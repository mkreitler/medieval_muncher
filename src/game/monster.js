blueprints.draft(
    "monster",

    // Data
    {
        LOITER_TIME_MS: 1000,
        moveState: null,
        moveDir: null,
        speed: 0,
        id: 0,
        goal: {x: -1, y: -1, newHeading: null, teleportTo: null},
        pattern: null,
        iHuntIndex: -1,
        visible: true,
    },

    // Actions
    {
        update: function(dtMS, map) {
            this.body2dUpdate(dtMS);
            this.spriteUpdate(dtMS);
            map.fadeSprite(this);

            if (this.moveState) {
                this.moveState(dtMS, map);
            }
        },

        onCreate: function() {
            jb.messages.listen("powerupBlinkOn", this);
            jb.messages.listen("powerupBlinkOff", this);
            jb.messages.listen("powerupStart", this);
            jb.messages.listen("powerupStop", this);
        },

        reset: function(x, y) {
            this.spriteMoveTo(x, y);
            this.goal.x = x;
            this.goal.y = y;
            this.iHuntIndex = 0;
            this.visible = true;
            this.weak = false;
        },

        powerupStart: function() {
            this.weak = true;
            this.move();
        },

        powerupStop: function() {
            this.weak = false;
            this.move();
        },

        powerupBlinkOn: function() {
            this.visible = true;
        },

        powerupBlinkOff: function() {
            this.visible = false;
        },

        hunt: function(map) {
            this.moveState = this.msHunt;
            this.moveDir = this.id % 2 ? "left" : "right";
            this.updateHuntGoal(map);
        },

        updateHuntGoal: function(map) {
            // Force perfect alignment.
            this.bounds.l = this.goal.x;
            this.bounds.t = this.goal.y;

            if (this.goal.teleportTo !== null) {
                this.spriteMoveTo(this.goal.teleportTo.x, this.goal.teleportTo.y);
                map.getPostTeleportGoal(this.bounds, this.moveDir, this.goal);
                this.goal.teleportTo = null;
            }
            else {
                map.getHuntGoal(this.bounds, this.moveDir, this.pattern.charAt(this.iHuntIndex), this.goal);
                this.iHuntIndex = (this.iHuntIndex + 1) % this.pattern.length;
            }
        },

        move: function() {
            if (this.weak) {
                this.spriteSetState("move_weak");
            }
            else {
                this.spriteSetState("move");
            }
        },

        idle: function() {
            if (this.weak) {
                this.spriteSetState("idle_weak");
            }
            else {
                this.spriteSetState("idle");
            }
        },

        draw: function(ctxt) {
            if (this.visible) {
                this.spriteDraw(ctxt);
            }
        },

        loiter: function(map) {
            this.moveDir = Math.random() < 0.5 ? "left" : "right";
            this.moveState = this.msLoiter;
            this.moveClock = this.LOITER_TIME_MS;
            map.getMonsterGoal(this.bounds, this.goal);
        },

        msHunt: function(dtMS, map) {
            var timePastGoal = 0;

            switch (this.moveDir) {
                case "up": case "down": {
                    timePastGoal = this.moveVertically(dtMS, map);

                    if (timePastGoal >= 0) {
                        this.moveDir = this.goal.newHeading;
                        this.updateHuntGoal(map);
                        this.msHunt(timePastGoal, map);
                    }
                }
                break;

                case "left": case "right": {
                    timePastGoal = this.moveLaterally(dtMS, map);

                    if (timePastGoal >= 0) {
                        this.moveDir = this.goal.newHeading;
                        this.updateHuntGoal(map);
                        this.msHunt(timePastGoal, map);
                    }
                }
                break;
            }
        },

        msLoiter: function(dtMS, map) {
            var testX = this.bounds.l;
            var testY = this.bounds.t;
            var dp = dtMS * 0.001 * this.speed;

            if (this.moveDir === "left") {
                var blocked = map.getBlockedInfo(testX - dp, testY + this.bounds.halfHeight);
                if (blocked) {
                    // Collide against right edge.
                    var blockX = blocked.blockInfo.l + blocked.blockInfo.w;
                    var timeToBlock = (blockX - this.bounds.l) / this.speed;
                    this.spriteMoveBy(-timeToBlock * this.speed, 0);
                    this.spriteSetScale(1, 1);
                    this.moveDir = "right";
                    this.msLoiter(Math.floor(dtMS - timeToBlock * 1000), map);
                }
                else {
                    this.spriteMoveBy(-dtMS * this.speed * 0.001, 0);
                    this.spriteSetScale(1, 1);
                }
            }
            else {
                var blocked = map.getBlockedInfo(testX + dp + this.bounds.w - 1, testY + this.bounds.halfHeight);
                if (blocked) {
                    // Collide against left edge.
                    var blockX = blocked.blockInfo.l - 1;
                    var timeToBlock = (this.bounds.l + this.bounds.w - 1 - blockX) / this.speed;
                    this.spriteMoveBy(timeToBlock * this.speed, 0);
                    this.spriteSetScale(-1, 1);
                    this.moveDir = "left";
                    this.msLoiter(Math.floor(dtMS - timeToBlock * 1000), map);
                }
                else {
                    this.spriteMoveBy(dtMS * this.speed * 0.001, 0);
                    this.spriteSetScale(-1, 1);
                }
            }

            this.moveClock -= dtMS;
            if (this.moveClock <= 0) {
                this.moveDir = this.goal.x - this.bounds.l < 0 ? "left" : "right";
                this.moveState = this.msMoveToLateralPoint;
            }
        },

        msMoveToLateralPoint: function(dtMS, map) {
            var timePastGoal = this.moveLaterally(dtMS, map);

            if (timePastGoal >= 0) {
                this.moveDir = (this.goal.y - this.bounds.t < 0) ? "up" : "down";
                this.moveState = this.msMoveToVerticalPoint;
                this.msMoveToVerticalPoint(timePastGoal, map);
            }
        },        

        msMoveToVerticalPoint: function(dtMS, map) {
            var timePastGoal = this.moveVertically(dtMS, map);

            if (timePastGoal >= 0) {
                this.hunt(map);
                this.msHunt(timePastGoal, map);
            }
        },

        moveLaterally: function(dtMS, map) {
            this.moveDir = this.goal.x - this.bounds.l < 0 ? "left" : "right";

            var timeToGoal = Math.abs(this.goal.x - this.bounds.l) / this.speed;
            var dt = Math.min(dtMS * 0.001, timeToGoal);
            var timeRemaining = 0;
            var curRow = map.rowFromY(this.bounds.t + this.bounds.halfHeight);
            var idealY = map.yFromRow(curRow);

            if (timeToGoal > 0) {
                if (this.moveDir === "left") {
                    this.spriteMoveBy(-dt * this.speed, (idealY - this.bounds.t) * 0.5);
                    this.spriteSetScale(1, 1);
                }
                else {
                    this.spriteMoveBy(dt * this.speed,  (idealY - this.bounds.t) * 0.5);
                    this.spriteSetScale(-1, 1);
                }

                timeRemaining = Math.floor(dtMS - timeToGoal * 1000);
                if (timeRemaining < jb.k.EPSLION) {
                    timeRemaining = 0;
                }
            }

            return timeRemaining;
        },

        moveVertically: function(dtMS, map) {
            this.moveDir = this.goal.y - this.bounds.t < 0 ? "up" : "down";

            var timeToGoal = Math.abs(this.goal.y - this.bounds.t) / this.speed;
            var dt = Math.min(dtMS * 0.001, timeToGoal);
            var timeRemaining = 0;
            var curCol = map.colFromX(this.bounds.l + this.bounds.halfWidth);
            var idealX = map.xFromCol(curCol);

            if (timeToGoal > 0) {
                if (this.moveDir === "up") {
                    this.spriteMoveBy((idealX - this.bounds.l) * 0.5, -dt * this.speed);
                }
                else {
                    this.spriteMoveBy((idealX - this.bounds.l) * 0.5, dt * this.speed);
                }

                timeRemaining = Math.floor(dtMS - timeToGoal * 1000);
                if (timeRemaining < jb.k.EPSLION) {
                    timeRemaining = 0;
                }
            }

            return timeRemaining;
        },
    
        move: function(dtMS, map) {
            switch (this.moveState) {
                case "up": {
                    this.spriteMoveBy(0, dtMS * -100 * 0.001);
                }
                break;
    
                case "right": {
                    this.spriteMoveBy(dtMS * 100 * 0.001, 0);
                    this.spriteSetScale(-1, 1);
                }
                break;
    
                case "down": {
                    this.spriteMoveBy(0, dtMS * 100 * 0.001);
                }
                break;
    
                case "left": {
                    this.spriteMoveBy(-dtMS * 100 * 0.001, 0);
                    this.spriteSetScale(1, 1);
                }
                break;
    
                default: {
                    // null result
                    // Nothing to do in this case...
                    this.idle();
                }
                break;
            }
        }
    },
);

blueprints.make("monster", ["sprite", "body2d"]);

jb.monster = {
    SPEED: 100,
    frames: null,
    iSpawn: 0,
    huntPatterns: [
        "rrlslrl",
        "llrlrlsr",
        "rllrlrrls",
        "lsrlrlslrr",
    ],

    create: function(tileSheet, idleRow, idleCol, weakRow, weakCol) {
        var it = blueprints.build("monster");
        it.spriteSetSheet(tileSheet);

        if (this.frames === null) {
            this.frames = {
                idle: [{row: idleRow, col: idleCol}],
                move: [{row: idleRow + 1, col: idleCol}, {row: idleRow, col: idleCol}],
                idle_weak: [{row: weakRow, col: weakCol}],
                move_weak: [{row: weakRow + 1, col: weakCol}, {row: weakRow, col: weakCol}],
            };
        }

         var states = {
            idle: jb.sprites.createState(this.frames["idle"], jb.k.IDLE_DT, true, null),
            move: jb.sprites.createState(this.frames["move"], jb.k.ANIM_DT, false, null),
            idle_weak: jb.sprites.createState(this.frames["idle_weak"], jb.k.IDLE_DT, true, null),
            move_weak: jb.sprites.createState(this.frames["move_weak"], jb.k.ANIM_DT, false, null),
        };

        it.speed = this.SPEED;
        it.id = this.iSpawn++ % jb.k.NUM_MONSTERS;
        it.pattern = this.huntPatterns[it.id % this.huntPatterns.length];
        it.spriteSetStates(states);
        it.spriteSetState("move");

        return it;
    }
};

