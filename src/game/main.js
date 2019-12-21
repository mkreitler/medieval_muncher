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
  IMAGES: {creatures: null, world: null, background: null, items: null},
  GAME_STATE: {UNKNOWN: -1, PLAYING: 0, DIED: 1, INTRO: 2, WON: 3},

  // VARIABLES ///////////////////////////////////////////////////////////////////
  tileSet: 0,
  worldTiles: null,
  creatureTiles: null,
  itemTiles: null,
  player: null,
  knight: null,
  origin: {x: -1, y: -1},
  iTileSet: 0,
  directions: ["up", "right", "down", "left"],
  monsters: [],
  gameState: -1,
  monsterType: {idleRow: -1, idleCol: -1, weakRow: -1, weakCol: -1},
  
  // GAME START //////////////////////////////////////////////////////////////////
  setup: function() {
    this.SCALE = jb.resizeToWindow(this.COLS * this.SIZE, this.ROWS * this.SIZE);

    for (var i=0; i<jb.k.NUM_MONSTERS; ++i) {
      this.monsters.push(null);
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

    // TODO: make this map-dependent.
    this.monsterType.idleRow = 20;
    this.monsterType.idleCol = 14;
    this.monsterType.weakRow = 20;
    this.monsterType.weakCol = 13;

    resources.loadWebFonts(["VT323"]);
  },

  do_waitForResourceLoad: function() {
    jb.until(resources.loadComplete());
  },

  initialize: function() {
    this.worldTiles = new jb.tileSheetObj(this.IMAGES.world, this.SIZE, this.SIZE);
    this.creatureTiles = new jb.tileSheetObj(this.IMAGES.creatures, this.SIZE, this.SIZE);
    this.itemTiles = new jb.tileSheetObj(this.IMAGES.items, this.SMALL_SIZE, this.SMALL_SIZE);
    jb.setWebFont("VT323");
    jb.setColumns(this.COLUMNS);
    jb.bank.init(this.itemTiles, this.SCALE);
    jb.powerups.init(this.itemTiles, this.SCALE);
    jb.messages.listen("levelComplete", this);

    this.origin.x = Math.floor((jb.program.COLS - jb.mapTest.map[0].length / 2) / 2) * jb.program.SIZE * jb.program.SCALE;
    this.origin.y = Math.floor((jb.program.ROWS - jb.mapTest.map.length) / 2) * jb.program.SIZE * jb.program.SCALE;

    jb.break();
  },
  
  buildLevel: function() {
    jb.bank.reset();
    jb.powerups.reset();

    var ts = jb.k.TILESET[this.iTileSet];
    jb.mapTest.create(this.SIZE, this.SCALE, this.origin, this.worldTiles, ts.row, ts.doorRow, ts.doorCol);

    this.knight = jb.playerKnight.create(this.creatureTiles, jb.mapTest.startX(), jb.mapTest.startY(), this.SCALE);

    for (var i=0; i<this.monsters.length; ++i) {
      this.monsters[i] = jb.monster.create(this.creatureTiles, this.monsterType.idleRow, this.monsterType.idleCol, this.monsterType.weakRow, this.monsterType.weakCol);
    }
    
    this.player = this.knight;
  },

  setup_userMove: function() {
    jb.printAt("Medieval Muncher", jb.rows / 2 + 1, Math.floor((this.COLUMNS - "Medieval Muncher".length + 2) * 0.5));

    this.player.reset(jb.mapTest, this.SIZE);

    this.gameState = this.GAME_STATE.PLAYING;

    for (var i=0; i<this.monsters.length; ++i) {
      var monsterStart = jb.mapTest.getMonsterStart();
      this.monsters[i].reset(monsterStart.x, monsterStart.y);
      this.monsters[i].loiter(jb.mapTest);
    }

    jb.listenForTap();
  },

  do_waitForTap: function() {
    jb.while(!jb.tap.done);
  },

  do_main_game_loop: function() {
    var dtMS = jb.time.deltaTimeMS;
    var maxDt = Math.floor(1000 * this.SIZE / Math.max(2 * this.monsters[0].speed, 2 * this.player.speed));
    
    while (!this.died && dtMS > jb.k.EPSILON) {
      maxDt = Math.min(maxDt, dtMS);

      var moveDir = this.getMoveDirection();
      this.player.update(moveDir, maxDt, jb.mapTest);

      for (var i=0; i<this.monsters.length; ++i) {
        this.monsters[i].update(maxDt, jb.mapTest);
      }

      jb.powerups.update(maxDt);
      this.checkPowerupCollisions();

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

    jb.while(this.gameState === this.GAME_STATE.PLAYING);
  },

  do_gameOver: function() {
    jb.printAt("Game Over", jb.rows / 2 + 1, Math.floor((this.COLUMNS - "Game Over".length + 2) * 0.5) + 1);
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
    if (this.didCollide(this.player, this.monsters[i])) {
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
