blueprints.draft(
    "player",

    // Data
    {
        speed: 0,
        moveDir: null,
        wantDir: null,
        scale: 1,
        powerup: null,
        wantsInvisibility: false,
        goal: {x: -1, y: -1, newHeading: null, teleportTo: null},
                testDirs: {
            "up": {dx: 0, dy: -1},
            "right": {dx: 1, dy: 0},
            "down": {dx: 0, dy: 1},
            "left": {dx: -1, dy: 0}
        },
        fireballs: null,
    },

    // Actions
    {
        coinCollected: function(coin) {
            // TODO: play a sound here...
        },

        onCreate: function() {
            jb.messages.listen("coinCollected", this);
            jb.messages.listen("collectPowerup", this);
            jb.messages.listen("dropPowerup", this);
        },

        reset: function(map, tileSize) {
            this.speed = jb.k.SPEED.PLAYER;
            this.idle();
            this.spriteMoveTo(map.startX(), map.startY());
            this.goal.x = this.bounds.l;
            this.goal.y = this.bounds.t;
            this.testDirs.down.dy = tileSize;
            this.testDirs.right.dx = tileSize;
            this.row = -1;
            this.col = -1;
            this.wantsInvisibility = false;
        },

        collectPowerup: function(powerup) {
            if (this.powerup) {
                jb.messages.broadcast("dropPowerup", this.powerup);
            }

            switch(powerup.type) {
                case jb.powerups.TYPES.SWORD: {

                }
                break;
                
                case jb.powerups.TYPES.CLOAK: {
                    this.wantsInvisibility = true;
                    this.spriteSetAlpha(jb.k.INVISIBILITY_ALPHA);
                }
                break;
                
                case jb.powerups.TYPES.SCROLL: {
                }
                break;
                
                default: {
                    jb.assert(false, "Collected unknown powerup!");
                }
                break;
            }

            this.powerup = powerup;
            jb.messages.broadcast("powerupStart", this.powerup);
        },

        dropPowerup: function(powerup) {
            jb.messages.broadcast("powerupStop", this.powerup);

            if (this.powerup === powerup) {
                this.powerup = null;
            }

            this.wantsInvisibility = false;
            this.spriteSetAlpha(1.0);
        },

        update: function(dir, dtMS, map) {
            this.move(dir, dtMS, map);
            this.body2dUpdate(dtMS);
            this.spriteUpdate(dtMS);

            this.row = map.rowFromY(this.bounds.t + this.bounds.halfHeight);
            this.col = map.colFromX(this.bounds.l + this.bounds.halfWidth);

            if (this.powerup) {
                this.powerup.update(dtMS, this.bounds, this.spriteInfo.scale.x, map);
            }
        },

        checkPowerupCollision: function(other) {
            if (this.powerup) {
                this.powerup.checkCollisionWith(this, other);
            }
        },

        draw: function(ctxt) {
            if (this.powerup) {
                this.powerup.preRender(this.bounds);
            }

            this.spriteDraw(ctxt);

            if (this.powerup) {
                this.powerup.draw(ctxt, this.spriteInfo.scale.x);
                this.powerup.postRender(this.bounds);
            }
        },

        getRow: function() {
            return this.row;
        },

        getCol: function() {
            return this.col;
        },

        walk: function() {
            this.spriteSetState("walk");
        },

        idle: function() {
            this.spriteSetState("idle");
        },

        move: function(dir, dtMS, map) {
            var oldDir = this.moveDir;
            this.wantDir = dir;
            
            if (map.getPlayerGoal(this.bounds, dir, this.goal)) {
                this.moveDir = this.wantDir;
            }
            
            if (this.moveDir) {
                this.walk();
                this.spriteSetDebugColor("yellow");

                switch (this.moveDir) {
                    case "up": case "down": {
                        this.moveDir = this.goal.y - this.bounds.t < 0 ? "up" : "down";
                        timePastGoal = this.moveVertically(dtMS, map);
    
                        if (timePastGoal >= 0) {
                            this.spriteSetDebugColor("red");

                            var teleporter = map.getTeleporterAt(this.bounds.l, this.bounds.t);
                            if (teleporter) {
                                this.teleportTo(teleporter);
                                if (map.getPlayerGoal(this.bounds, oldDir, this.goal)) {
                                    this.moveDir = oldDir;
                                }
                            }
                            else {
                                this.moveDir = null;
                            }
                        }
                    }
                    break;
    
                    case "left": case "right": {
                        this.moveDir = this.goal.x - this.bounds.l < 0 ? "left" : "right";
                        timePastGoal = this.moveLaterally(dtMS, map);
    
                        if (timePastGoal >= 0) {
                            this.spriteSetDebugColor("red");

                            var teleporter = map.getTeleporterAt(this.bounds.l, this.bounds.t);
                            if (teleporter) {
                                this.teleportTo(teleporter);
                                if (map.getPlayerGoal(this.bounds, oldDir, this.goal)) {
                                    this.moveDir = oldDir;
                                }
                            }
                            else {
                                this.moveDir = null;
                            }
                        }
                    }
                    break;

                    default: {
                        // Should never get here...
                        jb.assert(false, "Invalid player move direction!");
                    }
                }
            }
            else {
                this.idle();
            }

            if (!this.wantsInvisibility) {
                map.fadeSprite(this);
            }
        },

        teleportTo: function(teleporter) {
            this.spriteMoveTo(teleporter.x, teleporter.y);
            this.goal.x = teleporter.x * this.scale;
            this.goal.y = teleporter.y * this.scale;
        },

        // TODO: Create a parent component with moveLaterally and moveVertically
        // that both PlayerKnight and Monster can use (i.e., eliminate copy-pasted
        // code).
        moveLaterally: function(dtMS, map) {
            var timeToGoal = Math.abs(this.goal.x - this.bounds.l) / this.speed;
            var dt = Math.min(dtMS * 0.001, timeToGoal);
            var timeRemaining = 0;
            var curRow = map.rowFromY(this.bounds.t + this.bounds.halfHeight);
            var idealY = map.yFromRow(curRow);

            if (timeToGoal > dtMS * 0.001) {
                if (this.moveDir === "left") {
                    this.spriteMoveBy(-dt * this.speed, (idealY - this.bounds.t) * 0.5);
                    this.spriteSetScale(1, 1);
                }
                else {
                    this.spriteMoveBy(dt * this.speed,  (idealY - this.bounds.t) * 0.5);
                    this.spriteSetScale(-1, 1);
                }

                timeRemaining = Math.floor(dtMS - timeToGoal * 1000);
            }
            else {
                timeRemaining = 0;
                this.spriteMoveTo(this.goal.x / this.scale, this.goal.y / this.scale);
            }

            return timeRemaining;
        },

        moveVertically: function(dtMS, map) {
            var timeToGoal = Math.abs(this.goal.y - this.bounds.t) / this.speed;
            var dt = Math.min(dtMS * 0.001, timeToGoal);
            var timeRemaining = 0;
            var curCol = map.colFromX(this.bounds.l + this.bounds.halfWidth);
            var idealX = map.xFromCol(curCol);

            if (timeToGoal > dtMS * 0.001) {
                if (this.moveDir === "up") {
                    this.spriteMoveBy((idealX - this.bounds.l) * 0.5, -dt * this.speed);
                }
                else {
                    this.spriteMoveBy((idealX - this.bounds.l) * 0.5, dt * this.speed);
                }

                timeRemaining = Math.floor(dtMS - timeToGoal * 1000);
            }
            else {
                timeRemaining = 0;
                this.spriteMoveTo(this.goal.x / this.scale, this.goal.y / this.scale);
            }

            return timeRemaining;
        },
    },
);

blueprints.make("player", ["sprite", "body2d"]);

jb.player = {
    create: function(tileSheet, x, y, scale, frames, fxSheet) {
        var it = blueprints.build("player");
        it.spriteSetSheet(tileSheet);

        var states = {
            idle: jb.sprites.createState(frames["idle"], jb.k.IDLE_DT, true, null),
            walk: jb.sprites.createState(frames["walk"], jb.k.ANIM_DT, false, null),
        }

        it.spriteSetStates(states);
        it.spriteSetState("idle");
        it.spriteMoveTo(x, y);
        it.scale = scale;

        return it;
    }
};


    