blueprints.draft(
    "fireball",

    // Data
    {
        inFlight: false,
        direction: "",  
        flightTimer: 0, 
        scale: 1,
    },

    // Actions
    {
        setSheet: function(sheet) {
            this.spriteSetSheet(sheet);
            this.scale = this.bounds.w / this.spriteInfo.sheet.cellDx;
        },

        reset: function() {
            this.inFlight = false;
        },

        isInFlight: function() {
            return this.inFlight;
        },

        launch: function(x, y, goingRight) {
            this.inFlight = true;
            this.direction = goingRight ? "right" : "left";
            this.spriteSetState("shoot");
            if (!goingRight) {
                this.spriteSetScale(-1, 1);
            }
            else {
                this.spriteSetScale(1, 1);
            }
            this.spriteMoveTo(x / this.scale, y / this.scale);
        },

        despawn: function() {
            jb.messages.broadcast("spawnPuffParticle", jb.powerups.getParticleInfo(this.bounds.l + this.bounds.halfWidth, this.bounds.t + this.bounds.halfHeight));
            this.inFlight = false;
        },

        update: function(dtMS, map) {
            if (this.inFlight) {
                switch (this.direction) {
                    case "left": {
                        this.spriteMoveBy(-jb.k.SPEED.FIREBALL * dtMS / 1000, 0);
                    }
                    break;

                    case "right": {
                        this.spriteMoveBy(jb.k.SPEED.FIREBALL * dtMS / 1000, 0);
                    }
                    break;
                }

                var row = map.rowFromY(this.bounds.t + this.bounds.halfHeight);
                var col = map.colFromX(this.bounds.l + this.bounds.halfWidth);
                if (map.isPlayerBlocked(row, col) || !map.isInBounds(row, col)) {
                    this.despawn();
                }
            }
        },

        draw: function(ctxt) {
            if (this.inFlight) {
                this.spriteDraw(ctxt);
            }
        },
    },
);

blueprints.make("fireball", ["sprite"]);

jb.powerups = {
    TYPES: {SWORD: "sword", SCROLL: "scroll", CLOAK: "cloak"},
    HOVER_FREQ: 0.5,
    HOVER_AMP: 3,
    tileSheet: null,
    scale: 1,
    hoverHeight: 0,
    hoverTime: 0,
    cache: [],
    type: "",
    fireballs: [null, null],
    particleInfo: {x: -1, y: -1, text: ""},
    map: null,

    // Inner class
    info: function(row, col, type, tileRow, tileCol) {
        this.row = row;
        this.col = col;
        this.type = type;
        this.tileRow = tileRow;
        this.tileCol = tileCol;
        this.visible = true;
        this.timer = 0;
        this.x = 0;
        this.y = 0;
        this.wasBlinkOn = false;
    },

    init: function(tileSheet, scale, powerupType, fxSheet, map) {
        this.tileSheet = tileSheet;
        this.scale = scale;
        this.type = powerupType;
        this.map = map;

        this.info.prototype.update = function(dtMS, ownerBounds, xScale, map) {
            jb.powerups.updatePowerup(this, dtMS, ownerBounds, xScale, map);
        };

        this.info.prototype.preRender = function(ownerBounds) {
            jb.powerups.preRenderPowerup(this, ownerBounds);
        };

        this.info.prototype.draw = function(ctxt, xScale) {
            jb.powerups.drawPowerup(ctxt, this, xScale);
        };

        this.info.prototype.postRender = function(ownerBounds) {
            jb.powerups.postRenderPowerup(this, ownerBounds);
        };

        this.info.prototype.reset = function() {
            this.timer = 0;
            this.wasBlinkOn = false;
            this.visible = true;
        };

        this.info.prototype.checkCollisionWith = function(owner, other) {
            jb.powerups.radialCollisionWith(this, owner, other);
        };

        var states = {
            shoot: jb.sprites.createState(jb.k.fireballFrames, jb.k.IDLE_DT, true, null),
        }
        for (var i=0; i<this.fireballs.length; ++i) {
            var it = blueprints.build("fireball");
            it.setSheet(fxSheet);
            it.spriteSetStates(states);
            it.spriteSetAnchor(0.5, 0.5);
            this.fireballs[i] = it;
        }

        jb.messages.listen("spawnPowerup", this);
        jb.messages.listen("collectPowerup", this);
        jb.messages.listen("dropPowerup", this);
        this.cache.length = 0;
    },

    getParticleInfo: function(x, y, text) {
        this.particleInfo.x = x;
        this.particleInfo.y = y;
        this.particleInfo.text = text;

        return this.particleInfo;
    },

    checkCollisions: function(target) {
        // TODO: for collision between target and fireballs.
        var collided = false;

        for (var i=0; i<this.fireballs.length; ++i) {
            var fb = this.fireballs[i];
            if (fb.isInFlight()) {
                if (fb.spriteCollidesWith(target)) {
                    collided = true;
                    jb.messages.send("hitPowerup", target);
                    fb.despawn();
                    break;
                }
            }
        }

        return collided;
    },

    updatePowerupBlink: function(powerup) {
        var isBlinkOn = true;
        var warningInterval = jb.k.POWERUP_LIFETIME * jb.k.POWERUP_WARNING_SCALAR;

        if (powerup.timer > warningInterval) {
            var timeLeft = powerup.timer - warningInterval;

            if (timeLeft > 0) {
                var blinkCycle = Math.floor(jb.k.POWERUP_BLINKS * 2 * timeLeft / warningInterval);
                isBlinkOn = blinkCycle % 2 !== 0;
            }
            else {
                isBlinkOn = false;
            }
        }

        if (isBlinkOn != powerup.wasBlinkOn) {
            powerup.wasBlinkOn = isBlinkOn;

            if (isBlinkOn) {
                jb.messages.broadcast("powerupBlinkOn", powerup);
            }
            else {
                jb.messages.broadcast("powerupBlinkOff", powerup);
            }
        }
    },

    drawPowerup: function(ctxt, powerup, xScale) {
        jb.assert(powerup, "Can't draw power-up!");

        this.updatePowerupBlink(powerup)
        switch(powerup.type) {
            case this.TYPES.SWORD: {
                if (powerup.visible) {
                    this.tileSheet.draw(ctxt, powerup.tileRow, powerup.tileCol, powerup.x, powerup.y, 0.5, 0.5, xScale);
                }

                powerup.visible = true;
            }
            break;

            case this.TYPES.SCROLL: {
                // Fireballs are drawn by the owning player.
            }
            break;

            case this.TYPES.CLOAK: {
            }
            break;
        }
    },

    updatePowerup: function(powerup, dtMS, ownerBounds, xScale, map) {
        jb.assert(powerup && ownerBounds, "Can't update power-up!");

        switch(powerup.type) {
            case this.TYPES.SWORD: {
                powerup.timer += dtMS * 0.001;
                var dx = ownerBounds.w * jb.k.ORBIT_SCALAR * Math.sin(powerup.timer * Math.PI * 2.0 * jb.k.ORBIT_FREQ);
                var dy = ownerBounds.h * jb.k.ORBIT_SCALAR * Math.cos(powerup.timer * Math.PI * 2.0 * jb.k.ORBIT_FREQ);
                var x = xScale > 0 ? ownerBounds.l + ownerBounds.halfWidth : ownerBounds.l + 2 * ownerBounds.halfWidth;
                var y = ownerBounds.t + ownerBounds.halfHeight;

                powerup.x = x + dx;
                powerup.y = y + dy;

                if (powerup.timer > jb.k.POWERUP_LIFETIME) {
                    jb.messages.broadcast("dropPowerup", powerup);
                }
            }
            break;

            case this.TYPES.SCROLL: {
                powerup.timer += dtMS * 0.001;
                if (this.noFireballsInFlight()) {
                    if (powerup.timer > jb.k.POWERUP_LIFETIME) {
                        jb.messages.broadcast("dropPowerup", powerup);
                    }
                    else {
                        // TODO: can we launch our fireballs?
                        var blockInfo = map.areAdjacentsBlocked(ownerBounds);

                        if (blockInfo.leftClear) {
                            this.fireballs[0].launch(ownerBounds.l + ownerBounds.halfWidth, blockInfo.yIdeal, false);
                        }

                        if (blockInfo.rightClear) {
                            this.fireballs[1].launch(ownerBounds.l + ownerBounds.halfWidth, blockInfo.yIdeal, true);
                        }
                    }
                }
                else {
                    for (var i=0; i<this.fireballs.length; ++i) {
                        this.fireballs[i].update(dtMS, map);
                    }
                }
            }
            break;

            case this.TYPES.CLOAK: {
                powerup.timer += dtMS * 0.001;
                if (powerup.timer > jb.k.POWERUP_LIFETIME) {
                    jb.messages.broadcast("dropPowerup", powerup);
                }
            }
            break;
        }
    },

    noFireballsInFlight: function() {
        var noneInFlight = true;

        for (var i=0; i<this.fireballs.length; ++i) {
            if (this.fireballs[i].isInFlight()) {
                noneInFlight = false;
                break;
            }
        }

        return noneInFlight;
    },

    preRenderPowerup: function(powerup, ownerBounds) {
        jb.assert(powerup && ownerBounds, "Can't preRender power-up!");

        switch(powerup.type) {
            case this.TYPES.SWORD: {

            }
            break;

            case this.TYPES.SCROLL: {

            }
            break;

            case this.TYPES.CLOAK: {

            }
            break;
        }
    },

    postRenderPowerup: function(powerup, ownerBounds) {
        jb.assert(powerup && ownerBounds, "Can't postRender power-up!");

        switch(powerup.type) {
            case this.TYPES.SWORD: {

            }
            break;

            case this.TYPES.SCROLL: {

            }
            break;

            case this.TYPES.CLOAK: {

            }
            break;
        }
    },

    reset: function() {
        this.hoverHeight = 0;
        this.hoverTime = 0;

        for (var i=0; i<this.cache.length; ++i) {
            this.cache[i].reset();
        }

        for (var i=0; i<this.fireballs.length; ++i) {
            this.fireballs[i].reset();
        }
    },

    update: function(dtMS) {
        this.hoverTime += dtMS * 0.001;
        this.hoverHeight = this.HOVER_AMP * Math.sin(this.hoverTime * this.HOVER_FREQ * Math.PI * 2.0)
    },

    collidedWith: function(other, map) {
        var powerupHit = null;

        for (var i=0; i<this.cache.length; ++i) {
            var powerup = this.cache[i];
            if (powerup.visible) {
                var x = map.xFromColCenter(powerup.col);
                var y = map.yFromRowCenter(powerup.row);

                var dx = x - (other.bounds.l + other.bounds.halfWidth);
                var dy = y - (other.bounds.t + other.bounds.halfHeight);

                if (dx * dx + dy * dy < other.bounds.halfWidth * other.bounds.halfHeight) {
                    powerupHit = powerup;
                    break;
                }
            }
        }

        return powerupHit;
    },

    radialCollisionWith: function(powerup, owner, other) {
        jb.assert(powerup && other, "Invalid collision objects!");

        if (powerup.type === this.TYPES.SWORD) {
            var ownerCenterX = owner.bounds.l + owner.bounds.halfWidth;
            var ownerCenterY = owner.bounds.t + owner.bounds.halfHeight;

            var dx = powerup.x - ownerCenterX + this.tileSheet.cellDx / 2 * this.scale;
            var dy = powerup.y - ownerCenterY + this.tileSheet.cellDy / 2 * this.scale;
            var powerUpRadSq = dx * dx + dy * dy;

            dx = other.bounds.l + other.bounds.halfWidth - ownerCenterX;
            dy = other.bounds.t + other.bounds.halfHeight - ownerCenterY;

            if ((dx * dx + dy * dy) < powerUpRadSq * jb.k.COLLISION_FUDGE * jb.k.COLLISION_FUDGE) {
                jb.messages.send("hitPowerup", other, powerup);
            }
        }
    },

    collectPowerup: function(powerup) {
        jb.assert(powerup, "No powerup to collect!")

        jb.removeFromArray(this.cache, powerup, false);
        powerup.reset();
    },

    dropPowerup: function(powerup) {
        jb.assert(powerup, "No powerup to collect!")

        jb.messages.broadcast("powerupBlinkOn", powerup);

        powerup.visible = false;
        this.cache.push(powerup);
    },

    draw: function(ctxt, map) {
        for (var i=0; i<this.cache.length; ++i) {
            var powerup = this.cache[i];
            if (powerup.visible) {
                var x = map.xFromColCenter(powerup.col) - this.tileSheet.cellDx / 2 * this.scale;
                var y = map.yFromRowCenter(powerup.row) - (this.tileSheet.cellDy / 2 + this.hoverHeight) * this.scale;

                this.tileSheet.draw(ctxt, powerup.tileRow, powerup.tileCol, x, y, 0, 0);
            }
        }

        for (var i=0; i<this.fireballs.length; ++i) {
            if (this.fireballs[i].isInFlight()) {
                this.fireballs[i].draw(ctxt);
            }
        }
    },

    spawnPowerup: function(info) {
        var tileRow = -1;
        var tileCol = -1;
        
        switch (this.type) {
            case this.TYPES.SWORD: {
                tileRow = 9;
                tileCol = 12;
            }
            break;

            case this.TYPES.SCROLL: {
                tileRow = 6;
                tileCol = 3;
            }
            break;

            case this.TYPES.CLOAK: {
                tileRow = 11;
                tileCol = 9;
            }
            break;

            default: {
                jb.assert(false, "Unknown powerup type!");
            }
            break;
        }

        var newInfo = new this.info(info.row, info.col, this.type, tileRow, tileCol);
        this.cache.push(newInfo);
    }
};
