jb.program = {
  // CONSTANTS ////////////////////////////////////////////////////////////////////
  ROWS: 23,
  COLS: 33,
  SIZE: 24,
  SMALL_SIZE: 16,
  SCALE: 3,
  SCREEN_WIDTH: 640,
  SCREEN_HEIGHT: 480,
  IMAGES: {creatures: null, world: null, background: null, items: null, fx: null},
  GAME_STATE: {UNKNOWN: -1, PLAYING: 0, DIED: 1, INTRO: 2, WON: 3},

  // VARIABLES ///////////////////////////////////////////////////////////////////
  tileSet: 0,
  player: null,
  player: null,
  origin: {x: -1, y: -1},
  tileSet: null,
  playerFrames: null,
  input: "",
  directions: ["up", "right", "down", "left"],
  monsters: [],
  gameState: -1,
  level: 1,
  passwordEntered: false,
  maxSpeed: 0,
  minSize: Number.MAX_VALUE,
  sheets: {},
  clue: null,
  progression: [
    {character: "knight", tileSet: "dungeon", monster: "cubes", powerup: "sword", level: 1, clue: "Cellar imp's favorite sport?"},
    {character: "thief", tileSet: "crypt", monster: "skeletons", powerup: "cloak", level: 2, clue: "Mr. McSmibble's perch."},
    {character: "wizard", tileSet: "labyrinth", monster: "demons", powerup: "scroll", level: 3, clue: "Take your scores to Mom and Dad"},
  ],
  currentMap: 0,
  mapType: null,
  scoreMultiple: 1,
  targetStepVolume: 0,
  currentStepVolume: 0,
  breadcrumbs: [
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
  ],
  iCrumb: -1,
  debugBreadcrumbs: false,
  sounds: {
    cloak_on: {clip: null},
    collect_powerup: {clip: null},
    collect_start: {clip: null},
    collect_stop: {clip: null},
    collect_treasure: {clip: null},
    died: {clip: null},
    fireball_launch2: {clip: null},
    impact_sword: {clip: null},
    level_start: {clip: null},
    powerup_sword: {clip: null},
    spawn_treasure: {clip: null},
    steps_1: {clip: null},
    steps_2: {clip: null},
    victory: {clip: null},
    coins01: {clip: null},
    coins02: {clip: null},
    coins03: {clip: null},
    coins04: {clip: null},
    coins05: {clip: null},
    coins06: {clip: null},
  },
  fudgeFactor: 1.0,
  useStepSounds: false,
  coinSounds: [],
  lastCoinSoundIndex: -1,
  
  // GAME START //////////////////////////////////////////////////////////////////
  setup: function() {
    this.SCALE = jb.resizeToWindow(this.COLS * this.SIZE, this.ROWS * this.SIZE, false);

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

    jb.sound.createGroup("coins", 1);
    jb.sound.createGroup("themes", 10);

    for (var key in this.sounds) {
      this.sounds[key].clip = resources.loadSound(key + ".ogg");
      if (key.indexOf("coin") >= 0) {
        this.coinSounds.push(key);
        jb.sound.setGroup(this.sounds[key], "coins");
      }
    }

    jb.sound.setGroup(this.sounds["level_start"], "themes");
    jb.sound.setGroup(this.sounds["victory"], "themes");
    jb.sound.setGroup(this.sounds["died"], "themes");
    jb.sound.setGroup(this.sounds["spawn_treasure"], "themes");
    jb.sound.setGroup(this.sounds["collect_treasure"], "themes");

    // resources.loadWebFonts(["VT323"]);
  },

  do_waitForResourceLoad: function() {
    jb.until(resources.loadComplete());
  },

  do_showLevelSelect: function() {
    var iMessage = 0;
    var iRow = 0;
    var y0 = this.SCREEN_HEIGHT / 1.9;
    var spacer = this.SCREEN_WIDTH / 15;

    jb.clear();

    jb.setWebFont("VT323");
    jb.setColumns(jb.k.COLUMNS_LARGE);
    jb.printAtXY("Medieval Muncher", this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 5, 0.5, 0.5);

    jb.setColumns(jb.k.COLUMNS_SMALL);
    jb.printAtXY(jb.k.levelSelectInfo[iMessage++], this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 2.6, 0.5, 0.5);

    jb.setColumns(jb.k.COLUMNS_LARGE);
    jb.setForeColor("gray");
    for (var key in jb.k.playerTypes) {
      var y = y0 + iRow * spacer;
      jb.printAtXY(jb.k.levelSelectInfo[iMessage++], this.SCREEN_WIDTH / 2, y, 0.5, 0.5);
      ++iRow;
    }

    jb.setForeColor("white");

    if (jb.isTapped()) {
      var selection = (jb.tap.y - y0) / spacer;
      selection = Math.floor(Math.max(0, Math.min(selection, jb.k.levelSelectInfo.length - 2)));
      this.currentMap = selection;
      console.log("Selected " + this.currentMap);
    }

    jb.while(!jb.isTapped());
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

    this.customizeForProgression();

    jb.setForeColor("white");
    jb.setColumns(jb.k.COLUMNS_LARGE);
    jb.bank.init(this.sheets.itemTiles, this.SCALE);
    jb.monster.init();
    jb.powerups.init(this.sheets.itemTiles, this.SCALE, this.powerupType, this.sheets.fxTiles, jb.mapTest);
    jb.particles.init(this.sheets.fxTiles, this.SCALE);
    jb.treasures.init(this.sheets.itemTiles, jb.mapTest, this.scoreMultiple);
    jb.mapTest.init(this.mapType);

    jb.messages.listen("levelComplete", this);
    jb.messages.listen("playSound", this);
    jb.messages.listen("loopSound", this);
    jb.messages.listen("stopSound", this);
    jb.messages.listen("muteSound", this);
    jb.messages.listen("unmuteSound", this);
    jb.messages.listen("stopAllSounds", this);
    jb.messages.listen("playCoinSound", this);

    this.origin.x = Math.floor((jb.program.COLS - jb.mapTest.map[0].length / 2) / 2) * jb.program.SIZE * jb.program.SCALE;
    this.origin.y = Math.floor((jb.program.ROWS - jb.mapTest.map.length) / 2) * jb.program.SIZE * jb.program.SCALE;

    jb.listenForTap();

    // Force an update before we build the level so the messaging system
    // can register all the listeners created during initialization.
    jb.break();
  },
  
  buildLevel: function() {
    jb.mapTest.create(this.SIZE, this.SCALE, this.origin, this.sheets.worldTiles, this.tileSet.row, this.tileSet.doorRow, this.tileSet.doorCol, this.tileSet.floorRow, this.tileSet.floorCol);

    this.player = jb.player.create(this.sheets.creatureTiles, jb.mapTest.startX(), jb.mapTest.startY(), this.SCALE, this.playerFrames, jb.mapTest);

    for (var i=0; i<this.monsters.length; ++i) {
      this.monsters[i] = jb.monster.create(this.sheets.creatureTiles, this.monsterType.idleRow, this.monsterType.idleCol, this.monsterType.weakRow, this.monsterType.weakCol);
    }
  },

  showMainPage: function() {
    jb.startTimer("uiClock");
    jb.clearInput();
    this.reset();
  },

  do_updateMainPage: function() {
    var time = Math.floor(jb.timer("uiClock") * 1000 / jb.k.ANIM_DT);
    var iMessage = 0;
    var frame = time % 2;
    var iRow = 0;
    var x0 = this.SCREEN_WIDTH / 5;
    var y0 = this.SCREEN_HEIGHT / 1.9;
    var spacer = this.SCREEN_WIDTH / 20;

    jb.clear();

    jb.setColumns(jb.k.COLUMNS_LARGE);
    jb.printAtXY("Medieval Muncher", this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 5, 0.5, 0.5);

    jb.setColumns(jb.k.COLUMNS_SMALL);
    jb.printAtXY(jb.k.instructions[iMessage++], this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 2.6, 0.5, 0.5);

    jb.setForeColor("gray");
    for (var key in jb.k.playerTypes) {
      var y = y0 + iRow * spacer;
      var animInfo = jb.k.playerTypes[key].frames.walk[frame];
      this.sheets.creatureTiles.draw(jb.ctxt, animInfo.row, animInfo.col, 50, 50, 0.5, 0.5);
      this.sheets.creatureTiles.draw(jb.ctxt, animInfo.row, animInfo.col, x0, y, 0.5, 0.5);
      jb.printAtXY(jb.k.instructions[iMessage++], this.SCREEN_WIDTH / 2, y, 0.5, 0.5);
      ++iRow;
    }

    jb.setForeColor("white");
    jb.printAtXY("Press 'enter' to play", this.SCREEN_WIDTH / 2, 5 * this.SCREEN_HEIGHT / 6, 0.5, 0.5);

    jb.while(!jb.wasKeyPressed("return") && !jb.isTapped());
  },

  startGame: function() {
    // Try to init sound (after user click) so we can play the 'fail' clip, if necessary.
    if (!jb.sound.isEnabled) {
      jb.sound.init();
    }

    this.gameState = this.GAME_STATE.PLAYING;

    for (var i=0; i<this.monsters.length; ++i) {
      this.monsters[i].start(jb.mapTest, this.level);
    }

    this.loopSound("steps_2");
    if (this.useStepSounds) {
      this.loopSound("steps_1");
      this.muteSound("steps_1");
    }
    this.currentStepVolume = 0;
    this.targetStepVolume = 0;

    this.playSound("level_start");
    jb.startTimer("uiClock")
  },

  do_flashPlayer: function() {
    var param = Math.floor(jb.timer("uiClock") / jb.k.LEVEL_START_DELAY * jb.k.LEVEL_START_PLAYER_FLASHES);

    jb.clear();
    console.log("MMDEBUG <1>");
    jb.mapTest.draw(jb.ctxt, this.origin);
    console.log("MMDEBUG <2>");
    jb.bank.draw(jb.ctxt, jb.mapTest);
    jb.powerups.draw(jb.ctxt, jb.mapTest);
    jb.treasures.draw(jb.ctxt);

    if (param % 2 === 0) {
      this.player.draw(jb.ctxt);
    }

    for (var i=0; i<this.monsters.length; ++i) {
      this.monsters[i].draw(jb.ctxt);
    }
    jb.particles.draw(jb.ctxt);

    jb.listenForTap();

    jb.while(jb.timer("uiClock") < jb.k.LEVEL_START_DELAY);
  },

  do_main_game_loop: function() {
    var dtMS = jb.time.deltaTimeMS;
    var maxDt = Math.floor(jb.k.DEATH_FUDGE * jb.k.COLLISION_FUDGE * 1000 * this.minSize / this.maxSpeed * (1 - (this.level - 1) / 10));
    var moveDir = this.getMoveDirection();

    console.log("MMDEBUG <MAIN_LOOP>");

    // Update sound volumes outside the physics loop.
    // this.updateStepSounds(this.player.isCollecting(), dtMS);
    
    while (!this.died && dtMS > jb.k.EPSILON) {
      maxDt = Math.min(maxDt, dtMS);

      // Clear and draw these before the update so we can see debug drawings
      // performed during the updates.
      jb.clear();
      jb.mapTest.draw(jb.ctxt, this.origin);
  
      this.player.update(moveDir, maxDt, jb.mapTest);

      if (this.debugBreadcrumbs) {
        this.iCrumb += 1;
        this.iCrumb %= this.breadcrumbs.length;
        this.breadcrumbs[this.iCrumb].x = this.player.bounds.l;
        this.breadcrumbs[this.iCrumb].y = this.player.bounds.t;
      }

      jb.treasures.update(maxDt);

      for (var i=0; i<this.monsters.length; ++i) {
        this.monsters[i].update(maxDt, jb.mapTest);
        if (this.monsters[i].isAlive()) {
          this.player.checkPowerupCollision(this.monsters[i]);
          jb.powerups.checkCollisions(this.monsters[i]);
        }
      }

      jb.powerups.update(maxDt);
      jb.particles.update(maxDt);

      if (this.debugBreadcrumbs) {
        this.drawBreadcrumbs();
      }

      this.checkPowerupCollisions();
      this.checkMonsterCollisions();
      jb.treasures.checkCollision(this.player);
      jb.bank.collide(this.player.getRow(), this.player.getCol());

      dtMS -= maxDt;
    }

    jb.bank.draw(jb.ctxt, jb.mapTest);
    jb.powerups.draw(jb.ctxt, jb.mapTest);
    jb.treasures.draw(jb.ctxt);
    this.player.draw(jb.ctxt);
    for (var i=0; i<this.monsters.length; ++i) {
      this.monsters[i].draw(jb.ctxt);
    }
    jb.particles.draw(jb.ctxt);
    
    jb.while(this.gameState === this.GAME_STATE.PLAYING);
  },

  gameOver: function() {
    this.stopAllSounds();
    this.targetStepVolume = 0;
    this.currentStepVolume = 0;

    if (this.gameState === this.GAME_STATE.DIED) {
      jb.goto("playerDied");
    }
    else {
      jb.goto("playerWon");
    }
  },

  // Gosubs ///////////////////////////////////////////////////////////////////
  playerDied: function() {
    this.playSound("died");
    jb.startTimer("uiClock");
    jb.k.fudgeFactor -= jb.k.FUDGE_REDUCTION;
    jb.k.fudgeFactor = Math.max(jb.k.fudgeFactor, jb.k.MIN_FUDGE_FACTOR);
  },

  do_spinPlayer: function() {
    var time = jb.timer("uiClock");
    var angle = time * 360 * jb.k.DEATH_SPIN_FREQ;
    angle = Math.floor(angle / 90) * 90;

    jb.clear();

    jb.ctxt.globalAlpha = Math.max(0, 1.0 - time / jb.k.DEATH_SPIN_DURATION);
    jb.ctxt.globalAlpha *= jb.ctxt.globalAlpha;
    jb.mapTest.draw(jb.ctxt, this.origin);
    jb.ctxt.globalAlpha = 1.0;

    this.player.spriteSetAlpha(Math.max(0, 1.0 - time / jb.k.DEATH_SPIN_DURATION));
    this.player.spriteSetRotation(angle);
    this.player.spriteDraw(jb.ctxt);

    jb.while(jb.timer("uiClock") < jb.k.DEATH_SPIN_DURATION);
  },

  do_deathMessage: function() {
    jb.clear();
    jb.setForeColor("white");
    jb.setColumns(jb.k.COLUMNS_SMALL);
    jb.printAtXY("Press 'enter' to try again", this.SCREEN_WIDTH / 2, 2 * this.SCREEN_HEIGHT / 3, 0.5, 0.5, jb.k.FONT_SIZE_SMALL);
    jb.setColumns(jb.k.COLUMNS_LARGE);
    jb.printAtXY("Game Over", this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 3, 0.5, 0.5);
    jb.until(jb.isKeyDown("return") || jb.isTapped());
  },

  playAgainOne: function() {
    jb.goto("showMainPage");
  },

  playerWon: function() {
    this.playSound("victory");
    jb.startTimer("uiClock");

    // this.currentMap += 1;
    // this.currentMap %= this.progression.length;

    jb.k.fudgeFactor = 1.0;
  },

  do_flashBoard: function() {
    var time = jb.timer("uiClock");
    var phase = Math.floor(time / jb.k.CELEBRATION_DURATION * 2 * jb.k.WIN_FLASHES);

    phase = Math.min(phase, 2 * jb.k.WIN_FLASHES);

    jb.clear();

    if (phase % 2 === 1) {
      jb.mapTest.draw(jb.ctxt, this.origin);
    }

    jb.until(time > jb.k.CELEBRATION_DURATION);
  },

  do_winMessage: function() {
    jb.clear();
    jb.setColumns(jb.k.COLUMNS_SMALL);
    jb.printAtXY("Record your score: " + jb.bank.getScore(), this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 2, 0.5, 0.5, jb.k.FONT_SIZE_SMALL);

    jb.setForeColor("yellow");
    jb.printAtXY("Next Clue: " + this.clue, this.SCREEN_WIDTH / 2, 2 * this.SCREEN_HEIGHT / 3, 0.5, 0.5, jb.k.FONT_SIZE_SMALL);

    jb.setForeColor("white");
    jb.setColumns(jb.k.COLUMNS_LARGE);
    jb.printAtXY("You Won!", this.SCREEN_WIDTH / 2, this.SCREEN_HEIGHT / 3, 0.5, 0.5);
    jb.until(jb.isKeyDown("return") || jb.isTapped());
  },

  playAgainTwo: function() {
    jb.goto("showMainPage");
  },
};

// Procedures and Functions ///////////////////////////////////////////////////
jb.program.updateStepSounds = function(playerIsMoving, dtMS) {
  if (this.useStepSounds) {
    if (playerIsMoving) {
      this.targetStepVolume = 1;
    }
    else {
      this.targetStepVolume = 0;
    }

    var dv = this.targetStepVolume - this.currentStepVolume;
    var maxDv = dtMS /jb.k.STEP_FADE_TIME * (1.0 - 0.0);

    if (dv !== 0) {
      if (dv < 0) {
        dv *= -1;
        dv = Math.min(dv, maxDv);
        dv *= -1;
        this.currentStepVolume += dv;
      }
      if (Math.abs(dv) > maxDv) {
        dv = Math.min(dv, maxDv);
        this.currentStepVolume += dv;
      }

      if (Math.abs(this.targetStepVolume - this.currentStepVolume) < jb.k.EPSILON) {
        this.currentStepVolume = this.targetStepVolume;
      }

      jb.sound.setVolume(this.sounds["steps_1"].clip, this.currentStepVolume);
    }
  }
};

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

  if (keyVal === null) {
    // Alternate movement.
    if (jb.tap.done) {
      if (jb.tap.x < jb.canvas.width / 2) {
        keyVal = "A";
        numKeysDown += 1;
      }
      else {
        keyVal = "B";
        numKeysDown += 1;
      }

      jb.listenForTap();
    }
    else {
      if (jb.isKeyDown("A")) {
        keyVal = "A";
        numKeysDown += 1;
      }
      if (jb.isKeyDown("D")) {
        keyVal = "B";
        numKeysDown += 1;
      }
    }
  }

  if (numKeysDown !== 1) {
    keyVal = null;
  }

  return keyVal;
};

jb.program.customizeForProgression = function() {
  var succeeded = false;

  var options = this.progression[this.currentMap];

  if (options) {
    succeeded = true;

    jb.assert(jb.k.playerTypes.hasOwnProperty(options.character), "Unknown player type!");
    this.playerFrames = jb.k.playerTypes[options.character].frames;
    this.scoreMultiple = jb.k.playerTypes[options.character].scoreMultiple;

    jb.assert(jb.k.monsterTypes.hasOwnProperty(options.monster), "Unknown monster type!");    
    this.monsterType = jb.k.monsterTypes[options.monster];

    jb.assert(jb.k.mapTypes.hasOwnProperty(options.tileSet), "Unknown dungeon type!");
    this.mapType = options.tileSet;
    this.tileSet = jb.k.mapTypes[options.tileSet];

    options.powerup = options.powerup.toUpperCase();
    jb.assert(jb.powerups.TYPES.hasOwnProperty(options.powerup), "Unknown powerup type!");
    this.powerupType = jb.powerups.TYPES[options.powerup];

    jb.assert(options.hasOwnProperty("level"), "No difficulty level defined!");
    this.level = Math.max(1, parseInt(options.level));

    jb.assert(options.hasOwnProperty("clue"), "Missing clue!");
    this.clue = options.clue;
  }

  return succeeded;
};

jb.program.reset = function() {
  jb.bank.reset();
  jb.powerups.reset();
  jb.treasures.reset();
  jb.monster.reset();
  jb.particles.reset();
  this.player.reset(jb.mapTest, this.SIZE);
};

jb.program.drawBreadcrumbs = function() {
  jb.ctxt.lineWidth = 2;
  jb.ctxt.strokeStyle = "green";
  jb.ctxt.beginPath();
  for (var i=0; i<this.breadcrumbs.length; ++i) {
    jb.ctxt.rect(this.breadcrumbs[i].x, this.breadcrumbs[i].y, this.player.bounds.w, this.player.bounds.h);
  }
  jb.ctxt.closePath();
  jb.ctxt.stroke();
};

jb.program.playSound = function(name) {
  jb.assert(this.sounds[name], "Unknown sound!");

  jb.sound.play(this.sounds[name].clip);
};

jb.program.loopSound = function(name) {
  jb.assert(this.sounds[name], "Unknown sound!");

  jb.sound.loop(this.sounds[name].clip);
};

jb.program.stopSound = function(name) {
  jb.assert(this.sounds[name], "Unknown sound!");

  jb.sound.stop(this.sounds[name].clip);
};

jb.program.muteSound = function(name) {
  jb.assert(this.sounds[name], "Unknown sound!");

  jb.sound.setVolume(this.sounds[name].clip, 0);
};

jb.program.unmuteSound = function(name) {
  jb.assert(this.sounds[name], "Unknown sound!");

  jb.sound.setVolume(this.sounds[name].clip, 1);
};

jb.program.stopAllSounds = function() {
  jb.sound.stopAll();
};

jb.program.playCoinSound = function() {
  var randIndex = Math.floor(Math.random() * this.coinSounds.length);

  if (randIndex >= 0 && randIndex < this.coinSounds.length) {
    if (randIndex === this.lastCoinSoundIndex) {
      randIndex += 1;
      randIndex %= this.coinSounds.length;
    }

    this.lastCoinSoundIndex = randIndex;

    this.playSound(this.coinSounds[randIndex]);
  }
};
