blueprints.draft(
    "knight",

    // Data
    {
        speed: 0,
    },

    // Actions
    {
        reset: function(map) {
            this.speed = jb.playerKnight.SPEED;
            this.idle();
            this.spriteMoveTo(map.startX(), map.startY());
        },

        update: function(dt) {
            this.body2dUpdate(dt);
            this.spriteUpdate(dt);
        },

        walk: function() {
            this.spriteSetState("walk");
        },

        idle: function() {
            this.spriteSetState("idle");
        },
    
        move: function(dir, dtMS) {
            switch (dir) {
                case "up": {
                    this.spriteMoveBy(0, dtMS * -jb.playerKnight.SPEED * 0.001);
                    this.walk();
                }
                break;
    
                case "right": {
                    this.spriteMoveBy(dtMS * jb.playerKnight.SPEED * 0.001, 0);
                    this.spriteSetScale(-1, 1);
                    this.walk();
                }
                break;
    
                case "down": {
                    this.spriteMoveBy(0, dtMS * jb.playerKnight.SPEED * 0.001);
                    this.walk();
                }
                break;
    
                case "left": {
                    this.spriteMoveBy(-dtMS * jb.playerKnight.SPEED * 0.001, 0);
                    this.spriteSetScale(1, 1);
                    this.walk();
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

blueprints.make("knight", ["sprite", "body2d"]);

jb.playerKnight = {
    SPEED: 100,
    frames: null,

    create: function(tileSheet, x, y) {
        var it = blueprints.build("knight");
        it.spriteSetSheet(tileSheet);

        if (this.frames === null) {
            this.frames = {
                idle: [{row: 0, col: 0}],
                walk: [{row: 1, col: 0}, {row: 0, col: 0}]
            }
        }

        var states = {
            idle: jb.sprites.createState(this.frames["idle"], jb.k.IDLE_DT, true, null),
            walk: jb.sprites.createState(this.frames["walk"], jb.k.ANIM_DT, false, null),
        }

        it.spriteSetStates(states);
        it.spriteSetState("idle");
        it.spriteMoveTo(x, y);

        return it;
    }
};


