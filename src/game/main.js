jb.program = {
  // CONSTANTS ////////////////////////////////////////////////////////////////////
  ROWS: 23,
  COLS: 33,
  SIZE: 24,
  SMALL_SIZE: 16,
  SCALE: 3,
  SCREEN_WIDTH: 640,
  SCREEN_HEIGHT: 480,
  COLUMNS: 40,
  ANIM_DT: 33,
  IMAGES: {creatures: null, world: null, background: null, items: null, fx: null},
  GAME_STATE: {UNKNOWN: -1, PLAYING: 0, DIED: 1, INTRO: 2, WON: 3},

  // VARIABLES ///////////////////////////////////////////////////////////////////
  tileSet: 0,
  player: null,
  player: null,
  origin: {x: -1, y: -1},
  tileSet: null,
  playerFrames: null,
  directions: ["up", "right", "down", "left"],
  monsters: [],
  gameState: -1,
  level: 1,
  maxSpeed: 0,
  minSize: Number.MAX_VALUE,
  sheets: {},
  
  // GAME START //////////////////////////////////////////////////////////////////
  setup: function() {
    this.SCALE = jb.resizeToWindow(this.COLS * this.SIZE, this.ROWS * this.SIZE);

    for (var i=0; i<jb.k.NUM_MONSTERS; ++i) {
      this.monsters.push(null);
    }

    for (var key in jb.k.SPEED) {
      this.maxSpeed = Math.max(this.maxSpeed, jb.k.SPEED[key]);
    }

    var viewSize = jb.getViewSize()
    this.SCREEN_WIDTH = viewSize.width;
    this.SCREEN_HEIGHT = viewSize.height;

    jb.setBackColor("black");
    jb.setForeColor("white");
    jb.antiAlias(false);

    this.IMAGES.creatures = resources.loadImage("oryx_16bit_fantasy_creatures_trans.png");
    this.IMAGES.world = resources.loadImage("oryx_16bit_fantasy_world_trans.png");
    this.IMAGES.background = resources.loadImage("oryx_16bit_background_trans.png");
    this.IMAGES.items = resources.loadImage("oryx_16bit_fantasy_items_trans.png");
    this.IMAGES.fx = resources.loadImage("oryx_16bit_scifi_FX_sm_trans.png");

    // TODO: make this map-dependent.
    jb.assert(this.customizeForPassword("stalking"), "Customization failed!");
    // jb.assert(this.customizeForPassword("slay bells"), "Customization failed!");
    // jb.assert(this.customizeForPassword("santa claws"), "Customization failed!");

    resources.loadWebFonts(["VT323"]);
  },

  do_waitForResourceLoad: function() {
    jb.until(resources.loadComplete());
  },

  initialize: function() {
    var sheets = [];

    this.sheets.worldTiles = new jb.tileSheetObj(this.IMAGES.world, this.SIZE, this.SIZE);
    this.sheets.creatureTiles = new jb.tileSheetObj(this.IMAGES.creatures, this.SIZE, this.SIZE);
    this.sheets.itemTiles = new jb.tileSheetObj(this.IMAGES.items, this.SMALL_SIZE, this.SMALL_SIZE);
    this.sheets.fxTiles = new jb.tileSheetObj(this.IMAGES.fx, this.SIZE, this.SIZE);

    for (var key in this.sheets) {
      this.minSize = Math.min(this.minSize, this.sheets[key].cellDx * this.SCALE);
      this.minSize = Math.min(this.minSize, this.sheets[key].cellDy * this.SCALE);
    }

    jb.setWebFont("VT323");
    jb.setColumns(this.COLUMNS);
    jb.bank.init(this.sheets.itemTiles, this.SCALE);
    jb.monster.init();
    jb.powerups.init(this.sheets.itemTiles, this.SCALE, this.powerupType, this.sheets.fxTiles, jb.mapTest);
    jb.particles.init(this.sheets.fxTiles, this.SCALE);

    jb.messages.listen("levelComplete", this);

    this.origin.x = Math.floor((jb.program.COLS - jb.mapTest.map[0].length / 2) / 2) * jb.program.SIZE * jb.program.SCALE;
    this.origin.y = Math.floor((jb.program.ROWS - jb.mapTest.map.length) / 2) * jb.program.SIZE * jb.program.SCALE;

    jb.break();
  },
  
  buildLevel: function() {
    jb.bank.reset();
    jb.powerups.reset();

    jb.mapTest.create(this.SIZE, this.SCALE, this.origin, this.sheets.worldTiles, this.tileSet.row, this.tileSet.doorRow, this.tileSet.doorCol);

    this.player = jb.player.create(this.sheets.creatureTiles, jb.mapTest.startX(), jb.mapTest.startY(), this.SCALE, this.playerFrames);

    for (var i=0; i<this.monsters.length; ++i) {
      this.monsters[i] = jb.monster.create(this.sheets.creatureTiles, this.monsterType.idleRow, this.monsterType.idleCol, this.monsterType.weakRow, this.monsterType.weakCol);
    }
    
    this.player = this.player;
  },

  setup_userMove: function() {
    jb.printAtXY("Medieval Muncher", this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 2, 0.5, 0.5);

    this.player.reset(jb.mapTest, this.SIZE);

    this.gameState = this.GAME_STATE.PLAYING;

    for (var i=0; i<this.monsters.length; ++i) {
      this.monsters[i].start(jb.mapTest, this.level);
    }

    jb.listenForTap();
  },

  do_waitForTap: function() {
    jb.while(!jb.tap.done);
  },

  do_main_game_loop: function() {
    var dtMS = jb.time.deltaTimeMS;
    var maxDt = Math.floor(jb.k.DEATH_FUDGE * jb.k.COLLISION_FUDGE * 1000 * this.minSize / this.maxSpeed * (1 - (this.level - 1) / 10));
    
    while (!this.died && dtMS > jb.k.EPSILON) {
      maxDt = Math.min(maxDt, dtMS);

      var moveDir = this.getMoveDirection();
      this.player.update(moveDir, maxDt, jb.mapTest);

      for (var i=0; i<this.monsters.length; ++i) {
        this.monsters[i].update(maxDt, jb.mapTest);
        if (this.monsters[i].isAlive()) {
          this.player.checkPowerupCollision(this.monsters[i]);
          jb.powerups.checkCollisions(this.monsters[i]);
        }
      }

      jb.powerups.update(maxDt);
      this.checkPowerupCollisions();

      jb.particles.update(maxDt);

      this.checkMonsterCollisions();
      jb.bank.collide(this.player.getRow(), this.player.getCol());

      dtMS -= maxDt;
    }

    jb.clear();
    jb.mapTest.draw(jb.ctxt, this.origin);
    jb.bank.draw(jb.ctxt, jb.mapTest);
    jb.powerups.draw(jb.ctxt, jb.mapTest);
    this.player.draw(jb.ctxt);
    for (var i=0; i<this.monsters.length; ++i) {
      this.monsters[i].draw(jb.ctxt);
    }
    jb.particles.draw(jb.ctxt);
    
    jb.while(this.gameState === this.GAME_STATE.PLAYING);
  },

  do_gameOver: function() {
    jb.printAtXY("Game Over", this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 2, 0.5, 0.5);
    jb.while(true);
  },
};

// Procedures and Functions ///////////////////////////////////////////////////
jb.program.didCollide = function(mover, obstacle) {
  var dx = Math.abs(mover.bounds.l - obstacle.bounds.l);
  var dy = Math.abs(mover.bounds.t - obstacle.bounds.t);
  var didCollide = false;

  if (dx < mover.bounds.halfWidth * jb.k.DEATH_ACCURACY) {
    if (dy < (mover.bounds.halfHeight + obstacle.bounds.halfHeight) * jb.k.DEATH_FUDGE) {
      didCollide = true;
    }
  }
  else if (dy < mover.bounds.halfHeight * jb.k.DEATH_ACCURACY) {
    if (dx < (mover.bounds.halfWidth + obstacle.bounds.halfHeight) * jb.k.DEATH_FUDGE) {
      didCollide = true;
    }
  }

  return didCollide;
};

jb.program.checkPowerupCollisions = function() {
  var powerupHit = jb.powerups.collidedWith(this.player, jb.mapTest);
  if (powerupHit) {
    jb.messages.broadcast("collectPowerup", powerupHit);
  }
};

jb.program.checkMonsterCollisions = function() {
  for (var i=0; i<this.monsters.length; ++i) {
    if (!this.player.wantsInvisibility && this.monsters[i].visible && !this.monsters[i].weak && this.didCollide(this.player, this.monsters[i])) {
      this.gameState = this.GAME_STATE.DIED;
    }
  }
};

jb.program.levelComplete = function() {
  this.gameState = this.GAME_STATE.WON;
};

jb.program.getMoveDirection = function() {
  var keyVal = null;
  var numKeysDown = 0;

  for (var i=0; i<this.directions.length; ++i) {
    if (jb.isKeyDown(this.directions[i])) {
      keyVal = this.directions[i];
      ++numKeysDown;
    }
  }

  if (numKeysDown !== 1) {
    keyVal = null;
  }

  return keyVal;
};

jb.program.customizeForPassword = function(password) {
  var succeeded = false;

  password = password.toLowerCase();
  var options = jb.customization[password];

  if (options) {
    succeeded = true;

    jb.assert(jb.k.playerTypes.hasOwnProperty(options.character), "Unknown player type!");
    this.playerFrames = jb.k.playerTypes[options.character];

    jb.assert(jb.k.monsterTypes.hasOwnProperty(options.monster), "Unknown monster type!");    
    this.monsterType = jb.k.monsterTypes[options.monster];

    jb.assert(jb.k.mapTypes.hasOwnProperty(options.tileSet), "Unknown dungeon type!");
    this.tileSet = jb.k.mapTypes[options.tileSet];

    options.powerup = options.powerup.toUpperCase();
    jb.assert(jb.powerups.TYPES.hasOwnProperty(options.powerup), "Unknown powerup type!");
    this.powerupType = jb.powerups.TYPES[options.powerup];

    jb.assert(options.hasOwnProperty("level"), "No difficulty level defined!");
    this.level = Math.max(1, parseInt(options.level));
    console.log(">>> Setting difficulty level " + this.level);
  }

  return succeeded;
};
