/*
 * All particles must have the following interface:
 *   onSpawn(x, y): spawned at location x, y
 *   update(dtMS): update function, takes delta time in milliseconds
 *   draw(ctxt): draws the particle to the given context
 *   onDespawn(): removes the particle from the world
 * */
// Puff Particle //////////////////////////////////////////////////////////////
blueprints.draft(
    "textParticle",

    // Data
    {
        timer: 0,
        visible: false,
        manager: null,
        startPos: {x: -1, y: -1},
        endPos: {x: -1, y: -1},
        pos: {x: -1, y: -1},
        alpha: 1,
        text: "",
        visible: true,
    },

    // Actions
    {
        spawn: function(x, y, text) {
            this.reset();
            this.startPos.x = x;
            this.startPos.y = y;
            this.endPos.x = x;
            this.endPos.y = y + jb.particles.TEXT_TRANS_Y * jb.particles.scale;
            this.visible = true;
            this.text = text;
        },

        reset: function() {
            this.timer = 0;
        },

        update: function(dtMS) {
            this.timer += dtMS * 0.001;
            var param = this.timer / jb.particles.TEXT_DURATION;

            param = Math.min(1, Math.max(0, param));

            if (param > 1 - jb.k.EPSILON) {
                this.despawn();
            }
            else {
                this.pos.x = this.endPos.x * param + this.startPos.x * (1 - param);
                this.pos.x = Math.round(this.pos.x);
    
                this.pos.y =this.endPos.y * param + this.startPos.y * (1 - param);
                this.pos.y = Math.round(this.pos.y);

                this.alpha = Math.max(0, 1.0 - param);
            }
        },

        draw: function(ctxt) {
            if (this.visible) {
                var oldAlpha = ctxt.globalAlpha;
                ctxt.globalAlpha = this.alpha;
                jb.printAtXY(this.text, this.pos.x, this.pos.y, 0.5, 0.5, jb.particles.TEXT_SIZE * jb.particles.scale);
                ctxt.globalAlpha = oldAlpha;
            }
        },

        despawn: function() {
            this.visible = false;
            jb.particles.despawn(this, jb.particles.TYPE.TEXT);
        },
    },
);

blueprints.draft(
    "puffParticle",

    // Data
    {
        timer: 0,
        visible: false,
        localScale: 2,
    },

    // Actions
    {
        spawn: function(x, y) {
            this.reset();
            this.spriteSetState("puff");
            this.spriteSetAlpha(1.0);
            this.spriteSetAnchor(0.5, 0.5);
            this.spriteSetScale(this.localScale, this.localScale);
            this.spriteMoveTo(x / jb.particles.scale, y / jb.particles.scale);
            this.visible = true;
        },

        reset: function() {
            this.spriteResetTimer();
            this.timer = 0;
            this.visible = false;
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
            jb.particles.despawn(this, jb.particles.TYPE.PUFF);
        },
    }
);

blueprints.make("puffParticle", ["sprite"]);

// Text Particle //////////////////////////////////////////////////////////////

jb.particles = {
    TYPE: {PUFF: "puffs", TEXT: "text"},
    TEXT_DURATION: 1,
    TEXT_TRANS_Y: -10,
    TEXT_SIZE: 20,

    fxSheet: null,
    cache: {},
    active: [],
    puffFrames: null,
    scale: 1,

    init: function(tileSheet, scale) {
        this.fxSheet = tileSheet;
        this.scale = scale;

        jb.messages.listen("spawnPuffParticle", this);
        jb.messages.listen("spawnTextParticle", this);
    },

    reset: function() {
        while (this.active.length > 0) {
            this.cache.push(this.active.pop());
        }

        for (var i=0; i<this.cache.length; ++i) {
            this.cache[i].reset();
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

    spawnTextParticle: function(info) {
        var texts = this.cache[this.TYPE.TEXT];
        var newPart = null;

        if (!texts) {
            texts = [];
            this.cache[this.TYPE.TEXT] = texts;
        }

        if (texts.length === 0) {
            newPart = blueprints.build("textParticle");
        }
        else {
            newPart = texts.pop();
        }

        newPart.spawn(info.x, info.y, info.text);
        this.active.push(newPart);
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

        puff.spawn(info.x, info.y);
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

        return it;
    },
};