jb.powerups = {
    TYPES: {SWORD: "sword", SCROLL: "scroll", CLOAK: "cloak"},
    HOVER_FREQ: 0.5,
    HOVER_AMP: 3,
    tileSheet: null,
    scale: 1,
    hoverHeight: 0,
    hoverTime: 0,
    cache: [],

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

    init: function(tileSheet, scale) {
        this.tileSheet = tileSheet;
        this.scale = scale;

        this.info.prototype.update = function(dtMS, ownerBounds, xScale) {
            jb.powerups.updatePowerup(this, dtMS, ownerBounds, xScale);
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
        };

        jb.messages.listen("spawnPowerup", this);
        jb.messages.listen("collectPowerup", this);
        jb.messages.listen("dropPowerup", this);
        this.cache.length = 0;
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

        switch(powerup.type) {
            case this.TYPES.SWORD: {
                this.updatePowerupBlink(powerup)
                if (powerup.visible) {
                    this.tileSheet.draw(ctxt, powerup.tileRow, powerup.tileCol, powerup.x, powerup.y, 0.5, 0.5, xScale);
                }

                powerup.visible = true;
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

    updatePowerup: function(powerup, dtMS, ownerBounds, xScale) {
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

            }
            break;

            case this.TYPES.CLOAK: {

            }
            break;
        }
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
            this.cache[i].visible = true;
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
                var x = map.xFromColCenter(powerup.col) - this.tileSheet.cellDx / 2 * this.scale;
                var y = map.yFromRowCenter(powerup.row) - this.tileSheet.cellDy / 2 * this.scale;

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
    },

    spawnPowerup: function(info) {
        var powerupType = null;
        var tileRow = -1;
        var tileCol = -1;
        
        switch (info.type) {
            case 1: {
                powerupType = this.TYPES.SWORD;
                tileRow = 9;
                tileCol = 12;
            }
            break;

            case 2: {
                powerupType = this.TYPES.SCROLL;
                tileRow = 6;
                tileCol = 3;
            }
            break;

            case 3: {
                powerupType = this.TYPES.CLOAK;
                tileRow = 11;
                tileCol = 9;
            }
            break;

            default: {
                jb.assert(false, "Unknown powerup type!");
            }
            break;
        }

        var newInfo = new this.info(info.row, info.col, powerupType, tileRow, tileCol);
        this.cache.push(newInfo);
    }
};
