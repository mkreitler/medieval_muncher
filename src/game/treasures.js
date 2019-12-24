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
            jb.messages.broadcast("playSound", "spawn_treasure");
        },

        reset: function() {
            this.timer = 0;
        },

        update: function(dtMS) {
            this.timer += dtMS * 0.001;

            if (this.timer > jb.k.TREASURE_LIFETIME) {
                this.despawn();
            }
            else {
                var hoverY = jb.k.TREASURE_HOVER_HEIGHT * Math.sin(this.timer * Math.PI * 2 * jb.k.TREASURE_HOVER_FREQ);

                this.spriteMoveTo(this.baseX, this.baseY + hoverY)
            }
        },

        draw: function(ctxt) {
            this.spriteDraw(ctxt);
        },

        despawn: function() {
            jb.assert(this.manager, "Invalid manager!");

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
    scoreMultiplier: 1,

    particleInfo: {x: -1, y: -1, text: ""},

    getParticleInfo: function(x, y, text) {
        this.particleInfo.x = x;
        this.particleInfo.y = y;
        this.particleInfo.text = text;

        return this.particleInfo;
    },

    init: function(sheet, map, scoreMultiplier) {
        this.map = map;
        this.scoreMultiplier = scoreMultiplier;

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

    getScoreMultiplier: function() {
        return this.scoreMultiplier;
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
                var value = this.active.getValue() * this.scoreMultiplier;
                jb.messages.broadcast("scorePoints", value);
                jb.messages.broadcast("playSound", "collect_treasure");
                jb.messages.broadcast("spawnTextParticle", this.getParticleInfo(this.active.bounds.l + this.active.bounds.halfWidth,
                                                                                this.active.bounds.t + this.active.bounds.halfHeight,
                                                                                "" + value));

                this.active.despawn();

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
