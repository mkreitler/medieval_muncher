jb.k = {
    EPSILON: 0.001,
    COLUMNS_LARGE: 40,
    COLUMNS_SMALL: 80,
    NUM_MONSTERS: 4,
    IDLE_DT: 1000,
    ANIM_DT: 250,
    FAST_ANIM_DT: 67,
    DEATH_ALPHA: 0.33,
    SLIP_THROUGH_SIZE: 0.99,
    ALIGN_BLEND_FAST: 25.0,
    ALIGN_BLEND_SLOW: 25.0,
    DEATH_FUDGE: 0.5,
    DEATH_ACCURACY: 0.1,
    ORBIT_FREQ: 1.5,
    ORBIT_SCALAR: 1.167,
    POWERUP_LIFETIME: 5,
    POWERUP_WARNING_SCALAR: 0.5,
    POWERUP_BLINKS: 7,
    COLLISION_FUDGE: 0.9,
    MONSTER_RESPAWN_TIME: 1,
    WEAK_SPEED_FACTOR: 0.67,
    BASE_KILL_SCORE: 100,
    INVISIBILITY_ALPHA: 0.25,
    SPELL_TRIGGER_TOLERANCE: 0.25,
    SPEED: {PLAYER: 100, MONSTER: 100 * 1.03333, FIREBALL: 200},
    TREASURE_HOVER_HEIGHT: 3,
    TREASURE_HOVER_FREQ: 0.33,
    TREASURE_SPAWN_DELAY: 10,
    TREASURE_LIFETIME: 7,
    DEATH_SPIN_FREQ: 1,
    DEATH_SPIN_DURATION: 2,
    WIN_FLASHES: 4,
    CELEBRATION_DURATION: 2,
    instructions: [
      "Use arrow keys to collect gold and treasure",
      "Uses swords to defeat nearby enemies",
      "Has stealth cloak, 2x treasure bonus",
      "Uses fireballs to defeat distant enemies",
    ],
    treasures: {
        "mushroom": {
            value: 50,
            idle: [{row: 4, col: 5}],
        },
        "ring": {
            value: 100,
            idle: [{row: 3, col: 15}],
        },
        "tome": {
            value: 150,
            idle: [{row: 3, col: 3}],
        },
        "crown": {
            value: 200,
            idle: [{row: 6, col: 16}],
        },
    },
    playerTypes: {
      "knight": {
        scoreMultiple: 1,
        frames: {
          idle: [{row: 0, col: 0}],
          walk: [{row: 1, col: 0}, {row: 0, col: 0}],
        },
      },
      "thief": {
        scoreMultiple: 2,
        frames: {
          idle: [{row: 2, col: 2}],
          walk: [{row: 3, col: 2}, {row: 2, col: 2}]
        },
      },
      "wizard": {
        scoreMultiple: 1,
        frames: {
          idle: [{row: 4, col: 7}],
          walk: [{row: 5, col: 7}, {row: 4, col: 7}]
        },
      },
    },
    
    mapTypes: {
      "dungeon": {row: 13, doorRow: 3, doorCol: 28},
      "crypt": {row: 21, doorRow: 2, doorCol: 39},
      "labyrinth": {row: 5, doorRow: 2, doorCol: 41}
    },
  
    monsterTypes: {
      "cubes": {idleRow: 20, idleCol: 14, weakRow: 20, weakCol: 13},
      "skeletons": {idleRow: 16, idleCol: 5, weakRow: 16, weakCol: 5},
      "demons": {idleRow: 10, idleCol: 8, weakRow: 10, weakCol: 7},
    },

    fireballFrames: [{row: 14, col: 0}],
  };
