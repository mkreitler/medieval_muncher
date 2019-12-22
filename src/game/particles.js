/*
 * All particles must have the following interface:
 *   onSpawn(x, y): spawned at location x, y
 *   update(dtMS): update function, takes delta time in milliseconds
 *   draw(ctxt): draws the particle to the given context
 *   onDespawn(): removes the particle from the world
 * */
// Puff Particle //////////////////////////////////////////////////////////////
blueprints.draft(
    "puffParticle",

    // Data
    {
        timer: 0,
        visible: false,
        manager: null,
    },

    // Actions
    {
        setManager: function(manager) {
            this.manager = manager;
        },

        spawn: function(x, y) {
            this.spriteResetTimer();
            this.spriteSetState("puff");
            this.spriteMoveTo(x, y);
            this.spriteSetAlpha(1.0);
            this.visible = true;
            this.timer = 0;
        },

        update: function(dtMS) {
            this.timer += dtMS;

            var curNumFrames = this.spriteGetCurrentFrameCount();

            if (curNumFrames > 0) {
                var timeParam = this.timer / (this.spriteGetCurrentFrameCount() * jb.k.FAST_ANIM_DT);
                var alpha = Math.sqrt(Math.max(0, 1 - timeParam));
                this.spriteSetAlpha(alpha);
            }
            else {
                this.spriteSetAlpha(1.0);
            }

            this.spriteUpdate(dtMS);
        },

        draw: function(ctxt) {
            if (this.visible) {
                this.spriteDraw(ctxt);
            }
        },

        despawn() {
            if (this.manager) {
                this.manager.despawn(this, jb.particles.TYPE.PUFF);
            }
        },
    }
);

blueprints.make("puffParticle", ["sprite"]);

// Text Particle //////////////////////////////////////////////////////////////

jb.particles = {
    TYPE: {PUFF: "puffs", TEXT: "text"},

    fxSheet: null,
    cache: {},
    active: [],
    puffFrames: null,
    scale: 1,

    init: function(tileSheet, scale) {
        this.fxSheet = tileSheet;
        this.scale = scale;

        jb.messages.listen("spawnPuffParticle", this);
    },

    reset: function() {
        while (this.active.length > 0) {
            this.cache.push(this.active.pop());
        }
    },

    update: function(dtMS) {
        for (var i=0; i<this.active.length; ++i) {
            this.active[i].update(dtMS);
        }
    },

    draw: function(ctxt) {
        for (var i=0; i<this.active.length; ++i) {
            if (this.active[i].visible) {
                this.active[i].draw(ctxt);
            }
        }
    },

    despawn: function(particle, type) {
        jb.removeFromArray(this.active, particle, false);
        this.cache[type].push(particle);
    },

    spawnPuffParticle: function(info) {
        var puffs = this.cache[this.TYPE.PUFF];
        var puff = null;

        if (!puffs) {
            puffs = [];
            this.cache[this.TYPE.PUFF] = puffs;
        }

        if (puffs.length === 0) {
            puff = this.createPuff();
        }
        else {
            puff = puffs.pop();
        }

        puff.spawn(info.x / this.scale - this.fxSheet.cellDx / 2, info.y / this.scale - this.fxSheet.cellDy / 2);
        this.active.push(puff);
    },

    createPuff: function() {
        var it = blueprints.build("puffParticle");
        it.spriteSetSheet(this.fxSheet);

        if (this.puffFrames === null) {
            this.puffFrames = {
                puff: [{row: 10, col: 0}, {row: 10, col: 1}, {row: 10, col: 2}, {row: 10, col: 3}, {row: 10, col: 4, event: "despawn"}],
            };
        }

        var states = {
            puff: jb.sprites.createState(this.puffFrames["puff"], jb.k.FAST_ANIM_DT, true),
        };

        it.spriteSetStates(states);
        it.spriteSetState("puff");
        it.setManager(this);

        return it;
    },

    despawnSprite: function(sprite) {
        console.log("this: " + this + "   sprite: " + sprite);
    },
};