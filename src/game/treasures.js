blueprints.draft(
    "treasure",

    // Data
    {
        value: 0,
        timer: 0,
        baseX: -1,
        baseY: -1,
        manager: null,
    },

    // Actions
    {
        onCreate: function() {
            this.reset();
            this.spriteSetAnchor(0.5, 0.5);
        },

        getValue: function() {
            return this.value;
        },

        setManager: function(newManager) {
            this.manager = newManager;
        },

        spawn: function(x, y) {
            this.reset();
            this.baseX = x;
            this.baseY = y;
            this.spriteMoveTo(this.baseX, this.baseY);
        },

        reset: function() {
            this.timer = 0;
        },

        update: function(dtMS) {
            this.timer += dtMS * 0.001;

            if (this.timer > jb.k.TREASURE_LIFETIME) {
                this.despawn(false);
            }
            else {
                var hoverY = jb.k.TREASURE_HOVER_HEIGHT * Math.sin(this.timer * Math.PI * 2 * jb.k.TREASURE_HOVER_FREQ);

                this.spriteMoveTo(this.baseX, this.baseY + hoverY)
            }
        },

        draw: function(ctxt) {
            this.spriteDraw(ctxt);
        },

        despawn: function(wasCollected) {
            jb.assert(this.manager, "Invalid manager!");

            if (wasCollected) {
                jb.messages.broadcast("spawnTextParticle", jb.monster.getParticleInfo(this.bounds.l + this.bounds.halfWidth, this.bounds.t + this.bounds.halfHeight, "" + this.value));
            }

            jb.messages.broadcast("spawnPuffParticle", jb.monster.getParticleInfo(this.bounds.l + this.bounds.halfWidth, this.bounds.t + this.bounds.halfHeight));
            this.manager.onTreasureDespawned(this);
        },
    },
);

blueprints.make("treasure", ["sprite"]);

jb.treasures = {
    map: null,
    cache: [],
    active: null,
    spawnTimer: 0,

    init: function(sheet, map) {
        this.map = map;

        for (key in jb.k.treasures) {
            var treasure = jb.k.treasures[key];

            jb.assert(treasure.hasOwnProperty("value"), "Treasure has no value!");
            jb.assert(treasure.hasOwnProperty("idle"), "Treasure missing animation data!");

            var it = blueprints.build("treasure");
            it.value = treasure.value;

            var states = {
                idle: jb.sprites.createState(treasure.idle, jb.k.IDLE_DT, true, null),
            };
            it.spriteSetSheet(sheet);
            it.spriteSetStates(states);
            it.spriteSetState("idle");
            it.setManager(this);

            this.cache.push(it);
        }

        this.reset();
    },

    update: function(dtMS) {
        if (this.active) {
            this.active.update(dtMS);
        }
        else {
            // Try to spawn something after a time.
            var spawnSite = this.map.getTreasureSpawnSite();

            if (spawnSite) {
                this.spawnTimer += dtMS * 0.001;

                if (this.spawnTimer > jb.k.TREASURE_SPAWN_DELAY) {
                    this.active = jb.popRandom(this.cache);
                    this.active.spawn(spawnSite.x, spawnSite.y);
                }
            }
        }
    },

    draw: function(ctxt) {
        if (this.active) {
            this.active.draw(ctxt);
        }
    },

    reset: function() {
        this.spawnTimer = 0;

        if (this.active) {
            this.cache.push(this.active);
            this.active = null;
        }
    },

    checkCollision: function(other) {
        if (this.active) {
            if (this.active.bounds.overlap(other.bounds)) {
                jb.messages.broadcast("scorePoints", this.active.getValue());
                this.active.despawn(true);

            }
        }
    },

    onTreasureDespawned: function(treasure) {
        jb.assert(treasure === this.active, "Invalid treasure despawn!");

        this.spawnTimer = 0;
        this.cache.push(this.active);
        this.active = null;
    },
};
