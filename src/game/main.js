jb.program = {
  // CONSTANTS ////////////////////////////////////////////////////////////////////
  ROWS: 23,
  COLS: 33,
  SIZE: 24,
  SCALE: 3,
  SCREEN_WIDTH: 640,
  SCREEN_HEIGHT: 480,
  COLUMNS: 40,
  ANIM_DT: 33,
  IMAGES: {creatures: null, world: null, background: null, items: null},

  // VARIABLES ///////////////////////////////////////////////////////////////////
  tileSet: 0,
  worldTiles: null,
  creatureTiles: null,
  player: null,
  knight: null,
  origin: {x: -1, y: -1},
  iTileSet: 0,
  directions: ["up", "right", "down", "left"],
  monsters: [],

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

    resources.loadWebFonts(["VT323"]);
  },

  do_waitForResourceLoad: function() {
    jb.until(resources.loadComplete());
  },

  initialize: function() {
    this.worldTiles = new jb.tileSheetObj(this.IMAGES.world, this.SIZE, this.SIZE);
    this.creatureTiles = new jb.tileSheetObj(this.IMAGES.creatures, this.SIZE, this.SIZE);
    jb.setWebFont("VT323");
    jb.setColumns(this.COLUMNS);

    this.origin.x = Math.floor((jb.program.COLS - jb.mapTest.map[0].length / 2) / 2) * jb.program.SIZE * jb.program.SCALE;
    this.origin.y = Math.floor((jb.program.ROWS - jb.mapTest.map.length) / 2) * jb.program.SIZE * jb.program.SCALE;
    
    var ts = jb.k.TILESET[this.iTileSet];
    jb.mapTest.create(this.SIZE, this.SCALE, this.origin, this.worldTiles, ts.row, ts.doorRow, ts.doorCol);

    this.knight = jb.playerKnight.create(this.creatureTiles, jb.mapTest.startX(), jb.mapTest.startY());

    for (var i=0; i<this.monsters.length; ++i) {
      this.monsters[i] = jb.monster.create(this.creatureTiles, 20, 14);
    }
    
    this.player = this.knight;
  },

  setup_userMove: function() {
    jb.printAt("Medieval Muncher", jb.rows / 2 + 1, Math.floor((this.COLUMNS - "Medieval Muncher".length + 2) * 0.5));

    this.player.reset(jb.mapTest);

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

  do_test_map: function() {
    var dtMS = jb.time.deltaTimeMS;
    var maxDt = Math.floor(1000 * this.SIZE / Math.max(2 * this.monsters[0].speed, 2 * this.player.speed));
    
    jb.clear();
    jb.mapTest.draw(jb.ctxt, this.origin);
    
    while (dtMS > jb.k.EPSILON) {
      maxDt = Math.min(maxDt, dtMS);

      var moveDir = this.getMoveDirection();
      this.player.move(moveDir, maxDt);
      this.player.update(maxDt);

      for (var i=0; i<this.monsters.length; ++i) {
        this.monsters[i].update(maxDt, jb.mapTest);
      }

      if (moveDir) {
        this.player.bounds.copyFrom(jb.mapTest.collide(moveDir, this.player, maxDt));
        jb.mapTest.fadeSprite(this.player);
      }

      dtMS -= maxDt;
    }

    this.player.spriteDraw(jb.ctxt);
    for (var i=0; i<this.monsters.length; ++i) {
      this.monsters[i].spriteDraw(jb.ctxt);
    }

    jb.while(true);
  },
};

// Procedures and Functions ///////////////////////////////////////////////////
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
