// Define the jb objects
jb = {
  EPSILON: 0.003,
  execStack: [],
  hasInternet: null,
  assert: function(test, msg) {
      if (!test) {
          console.log(msg);

          jb.setForeColor("red");
          jb.setBackColor("black");
          jb.setColumns(Math.round(msg.length * 1.25));
          jb.clear();
          jb.printAtXY(msg, jb.canvas.width / 2, jb.canvas.height / 2, 0.5, 0.5);

          debugger;

          jb.end();
      }
  },
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// oooooo   oooooo     oooo            .o8       oooooo     oooo            o8o                      
//  `888.    `888.     .8'            "888        `888.     .8'             `"'                      
//   `888.   .8888.   .8'    .ooooo.   888oooo.    `888.   .8'    .ooooo.  oooo   .ooooo.   .ooooo.  
//    `888  .8'`888. .8'    d88' `88b  d88' `88b    `888. .8'    d88' `88b `888  d88' `"Y8 d88' `88b 
//     `888.8'  `888.8'     888ooo888  888   888     `888.8'     888   888  888  888       888ooo888 
//      `888'    `888'      888    .o  888   888      `888'      888   888  888  888   .o8 888    .o 
//       `8'      `8'       `Y8bod8P'  `Y8bod8P'       `8'       `Y8bod8P' o888o `Y8bod8P' `Y8bod8P' 
/////////////////////////////////////////////////////////////////////////////////////////////////////

webVoice = {};

webVoice.get = function() {
  // alert("Your web browser does not support voice recognition. Please upgrade to Google Chrome 25 or higher.");
  return false;
};

webVoice.init = function(fnOnStart, fnOnEnd, fnOnResult, fnOnError, bContinuous, bInterim) {
  var recog = webVoice.get();

  if (recog) {
      recog.onstart = fnOnStart;
      recog.onend = fnOnEnd;
      recog.onresult = fnOnResult;
      recog.onerror = fnOnError;
      recog.continuous = bContinuous ? true : false;
      recog.interimResults = bInterim ? true : false;
  }
};

(function() {
  var recognition = null;

  if (('webkitSpeechRecognition' in window)) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;

      webVoice.get = function() {
          return recognition;
      }
  }
})();


// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ooooooooo.         .o.       ooooooooo.    .oooooo..o oooooooooooo ooooooooo.   
// `888   `Y88.      .888.      `888   `Y88. d8P'    `Y8 `888'     `8 `888   `Y88. 
//  888   .d88'     .8"888.      888   .d88' Y88bo.       888          888   .d88' 
//  888ooo88P'     .8' `888.     888ooo88P'   `"Y8888o.   888oooo8     888ooo88P'  
//  888           .88ooo8888.    888`88b.         `"Y88b  888    "     888`88b.    
//  888          .8'     `888.   888  `88b.  oo     .d8P  888       o  888  `88b.  
// o888o        o88o     o8888o o888o  o888o 8""88888P'  o888ooooood8 o888o  o888o 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
parser = {

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ooooooooo.   oooooooooooo  .oooooo.o   .oooooo.   ooooo     ooo ooooooooo.     .oooooo.   oooooooooooo  .oooooo.o 
// `888   `Y88. `888'     `8 d8P'    `Y8  d8P'  `Y8b  `888'     `8' `888   `Y88.  d8P'  `Y8b  `888'     `8 d8P'    `Y8 
//  888   .d88'  888         Y88bo.      888      888  888       8   888   .d88' 888           888         Y88bo.      
//  888ooo88P'   888oooo8     `"Y8888o.  888      888  888       8   888ooo88P'  888           888oooo8     `"Y8888o.  
//  888`88b.     888    "         `"Y88b 888      888  888       8   888`88b.    888           888    "         `"Y88b 
//  888  `88b.   888       o oo     .d8P `88b    d88'  `88.    .8'   888  `88b.  `88b    ooo   888       o oo     .d8P 
// o888o  o888o o888ooooood8 8""88888P'   `Y8bood8P'     `YbodP'    o888o  o888o  `Y8bood8P'  o888ooooood8 8""88888P'  
// Resources /////////////////////////////////////////////////////////////////////////////////////////////////////////
resources = {
  resourcesPending: 0,
  resourcesLoaded: 0,
  resourcesRequested: 0,
  bResourceLoadSuccessful: true,
  webFontsLoaded: true,
  webFontNames: [],

  incPendingCount: function() {
      resources.resourcesPending += 1;
      resources.resourcesRequested += 1;
  },

  incLoadedCount: function(bLoadSuccessful) {
      resources.resourcesLoaded += 1;
      resources.resourcesPending -= 1;

      resources.bResourceLoadSuccessful &= bLoadSuccessful;
  },

  getLoadProgress: function() {
      var completion = resources.resourcesRequested > 0 ? resources.resourcesLoaded / resources.resourcesRequested : 1.0;

      if (!resources.bResourceLoadSuccessful) {
          completion *= -1.0;
      }

      return completion;
  },

  getLoadedCount: function() {
      return resources.resourcesLoaded;
  },

  loadComplete: function() {
      var bLoadComplete = (resources.resourcesPending === 0) && (resources.resourcesLoaded === resources.resourcesRequested) && resources.webFontsLoaded;
      return bLoadComplete;
  },

  loadSuccessful: function() {
      return resources.bResourceLoadSuccessful;
  },

  loadWebFonts: function(fontNameArray) {
      resources.webFontsLoaded = false;

      if (fontNameArray == null) {
          fontNameArray = [];
      } else if (fontNameArray instanceof Array == false) {
          var newArray = [];
          newArray.push(fontNameArray);
          fontNameArray = newArray;
      }

      resources.webFontNames = fontNameArray

      // Add TypeKit to the page...
      window.WebFontConfig = {
          google: {
              families: fontNameArray
          },
          active: function() {
              resources.webFontsLoaded = true;
          },
          inactive: function() {
              resources.webFontsLoaded = true;
          },
          fontactive: function(familyName, fvd) {
              var hiddenDiv = document.createElement("div");
              hiddenDiv.style.fontFamily = familyName;
              hiddenDiv.style.visibility = "hidden";
              hiddenDiv.innerHTML += familyName + " loaded";
              document.body.appendChild(hiddenDiv)
          },
          timeout: 3333
      };

      resources.webFontLoader()
  },

  webFontLoader: function() {
      if (navigator.onLine) {
          var wf = document.createElement('script');
          wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
              '://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
          wf.type = 'text/javascript';
          wf.async = 'true';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(wf, s);
      } else {
          resources.webFontsLoaded = true;
      }
  },

  loadFont: function(fontName, fontPath, fontType) {
      var fontInfo = {
              openTypeFont: null,
              loadErr: null
          },
          fullURL = (fontPath || "./res/fonts") + "/" + fontName + "." + (fontType || "ttf");

      fullURL = fullURL.replace("//", "/");

      resources.incPendingCount();

      opentype.load(fullURL, function(err, font) {
          if (err) {
              fontInfo.loadErr = err;
              resources.incLoadedCount(false);
          } else {
              fontInfo.openTypeFont = font;
              resources.incLoadedCount(true);
          }
      });

      return fontInfo;
  },

  loadImage: function(imageURL, imagePath) {
      var image = new Image(),
          fullURL = (imagePath || "./res/images/") + imageURL;

      resources.incPendingCount();

      image.onload = function() {
          resources.incLoadedCount(true);
      }

      image.onerror = function() {
          resources.incLoadedCount(false);
      }

      image.src = fullURL;

      return image;
  },

  loadSound: function(soundURL, resourcePath, nChannels, repeatDelaySec) {
      var path = resourcePath || "./res/sounds/";

      soundURL = path + soundURL;
      nChannels = nChannels || 2;
      repeatDelaySec = repeatDelaySec || 0.33;

      resources.incPendingCount();

      return jb.sound.load(soundURL,
          function() {
              resources.incLoadedCount(true);
          },
          function() {
              resources.incLoadedCount(false);
          },
          nChannels, repeatDelaySec);
  },
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// oooooooooo.  ooooo        ooooo     ooo oooooooooooo ooooooooo.   ooooooooo.   ooooo ooooo      ooo ooooooooooooo  .oooooo.o 
// `888'   `Y8b `888'        `888'     `8' `888'     `8 `888   `Y88. `888   `Y88. `888' `888b.     `8' 8'   888   `8 d8P'    `Y8 
//  888     888  888          888       8   888          888   .d88'  888   .d88'  888   8 `88b.    8       888      Y88bo.      
//  888oooo888'  888          888       8   888oooo8     888ooo88P'   888ooo88P'   888   8   `88b.  8       888       `"Y8888o.  
//  888    `88b  888          888       8   888    "     888          888`88b.     888   8     `88b.8       888           `"Y88b 
//  888    .88P  888       o  `88.    .8'   888       o  888          888  `88b.   888   8       `888       888      oo     .d8P 
// o888bood8P'  o888ooooood8    `YbodP'    o888ooooood8 o888o        o888o  o888o o888o o8o        `8      o888o     8""88888P'  
// Blueprints //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Usage:
//
// Define a new blueprint:
// blueprints.draft(
//   "testKnight",
//
//   // Data
//   {
//     ...
//   },
//
//   // Actions
//   {
//     ...
//   },
// );
//
// Extend an existing blueprint with components:
// blueprints.make("testKnight", ["touchable", "sprite", ...])
//
// Instantiate an object from a blueprint:
// blueprints.build("testKnight");
//
blueprints = {
  mixins: {},

  make: function(blueprint, extension) {
      if (extension instanceof Array) {
          for (var i = 0; i < extension.length; ++i) {
              this.make(blueprint, extension[i]);
          }
      } else {
          var key = null,
              bpData = blueprints[blueprint],
              mixin = blueprints.mixins[extension],
              proto = bpData ? bpData.proto : null;

          if (bpData && mixin && proto) {
              for (key in mixin) {
                  if (key.indexOf(extension) >= 0) {
                      proto[key] = mixin[key];
                  }
              }

              proto._components.push(extension);
          }
      }
  },

  draft: function(name, dataObj, classObj) {
      var args = Array.prototype.slice.call(arguments),
          propObj = {},
          key = null;

      if (!blueprints[name]) {
          classObj._components = [];
          classObj.destroy = function() {
              var i = 0;

              for (i = 0; i < this._components.length; ++i) {
                  blueprints.mixins[this._components[i]].destroy(this);
              }
          }

          for (key in dataObj) {
              propObj[key] = {
                  value: dataObj[key],
                  writable: true,
                  enumerable: true,
                  configurable: true
              };
          }

          blueprints[name] = {
              data: propObj,
              proto: classObj
          };
      }
  },

  build: function(name) {
      var instance = null,
          template = blueprints[name],
          i = 0,
          mixin = null,
          args = [];

      if (template) {
          // Build argument list.
          for (i = 1; i < arguments.length; ++i) {
              args.push(arguments[i]);
          }

          instance = Object.create(template.proto, JSON.parse(JSON.stringify(template.data)));

          for (i = 0; i < template.proto._components.length; ++i) {
              mixin = blueprints.mixins[template.proto._components[i]];
              if (mixin) {
                  mixin.spawn(instance);
              }
          }

          if (instance.onCreate) {
              instance.onCreate.apply(instance, args);
          }
      }

      return instance;
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   .oooooo.     .oooooo.   ooo        ooooo ooooooooo.     .oooooo.   ooooo      ooo oooooooooooo ooooo      ooo ooooooooooooo  .oooooo.o 
//  d8P'  `Y8b   d8P'  `Y8b  `88.       .888' `888   `Y88.  d8P'  `Y8b  `888b.     `8' `888'     `8 `888b.     `8' 8'   888   `8 d8P'    `Y8 
// 888          888      888  888b     d'888   888   .d88' 888      888  8 `88b.    8   888          8 `88b.    8       888      Y88bo.      
// 888          888      888  8 Y88. .P  888   888ooo88P'  888      888  8   `88b.  8   888oooo8     8   `88b.  8       888       `"Y8888o.  
// 888          888      888  8  `888'   888   888         888      888  8     `88b.8   888    "     8     `88b.8       888           `"Y88b 
// `88b    ooo  `88b    d88'  8    Y     888   888         `88b    d88'  8       `888   888       o  8       `888       888      oo     .d8P 
//  `Y8bood8P'   `Y8bood8P'  o8o        o888o o888o         `Y8bood8P'  o8o        `8  o888ooooood8 o8o        `8      o888o     8""88888P'  
// Components //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// All components must define 'spawn', and 'destroy' functions in order
// to be correctly added/removed by the 'blueprint' object.

///////////////////////////////////////////////////////////////////////////////
// State Machines
///////////////////////////////////////////////////////////////////////////////
jb.stateMachines = {
  machines: [],
  updating: [],
  toAdd: [],
  toRemove: [],

  addMachine: function(machine) {
      if (this.machines.indexOf(machine) < 0) {
          this.machines.push(machine);
      }
  },

  removeMachine: function(machine) {
      jb.removeFromArray(this.machines, machine);
      jb.removeFromArray(this.updating, machine, true);
  },

  transitionTo: function(that, state) {
      var bWantsUpdate = false,
          bTransitioned = false;

      that.smNextState = null;

      if (state && state !== that.smCurrentState) {
          // Exit current state.
          if (that.smCurrentState && that.smCurrentState.exit) {
              that.smCurrentState.exit.call(that);
          }

          that.smCurrentState = state;

          if (that.smCurrentState) {
              if (that.smCurrentState.enter) {
                  that.smCurrentState.enter.call(that);
              }

              bWantsUpdate = true;
          }

          bTransitioned = true;
      } else if (state === null) {
          that.smCurrentState = null;
      }

      return bTransitioned;
  },

  update: function() {
      var i = 0,
          that = null;

      if (this.toAdd.length) {
          for (i = 0; i < this.toAdd.length; ++i) {
              that = this.toAdd[i];
              jb.assert(that.smNextState, "Starting state machine has to starting state!");
              jb.assert(!that.smCurrentState, "Starting state machine has existing state!");

              that.smCurrentState = that.smNextState;

              if (that.smNextState.enter) {
                  that.smNextState.enter.call(that);
              }

              this.updating.push(this.toAdd[i]);
          }
          this.toAdd.length = 0;
      }

      for (i = 0; i < this.updating.length; ++i) {
          that = this.updating[i];

          if (that.smNextState && that.smNextState !== that.smCurrentState) {
              if (that.smCurrentState.exit) {
                  that.smCurrentState.exit.call(that);
              }

              that.smCurrentState = that.smNextState;
              that.smNextState = null;
          }

          if (that.smCurrentState) {
              that.smAllowStateChange = true;

              if (that.smCurrentState.update) {
                  that.smCurrentState.update.call(that, jb.time.deltaTime);

                  if (that.smNextState && that.smNextState !== that.smCurrentState) {
                      if (that.smCurrentState.exit) {
                          that.smCurrentState.exit.call(that);
                      }

                      if (that.smNextState.enter) {
                          that.smNextState.enter.call(that);
                      }

                      that.smCurrentState = that.smNextState;
                      that.smNextState = null;
                  }
              } else {
                  // No update state, so force a stop.
                  that.stateMachineStop();
              }

              that.smAllowStateChange = false;
          }
      }

      if (this.toRemove.length) {
          for (i = 0; i < this.toRemove.length; ++i) {
              that = this.toRemove[i];
              jb.assert(that.smCurrentState, "Stopping state machine has no state!");

              if (that.smCurrentState.exit) {
                  that.smCurrentState.exit.call(that);
              }

              that.smCurrentState = null;

              jb.removeFromArray(jb.stateMachines.updating, that, true);
          }
          this.toRemove.length = 0;
      }
  },

  // Blueprint Interface //////////////////////////////////////////////////////
  spawn: function(instance) {
      if (!instance.smCurrentState) {
          instance.smCurrentState = null;
      }

      if (!instance.smNextState) {
          instance.smNextState = null;
      }

      if (!instance.smAllowStateChange) {
          instance.smAllowStateChange = false;
      }

      this.addMachine(instance);
  },

  destroy: function(instance) {
      this.removeMachine(instance);
  },

  // Mixins ///////////////////////////////////////////////////////////////////
  stateMachineStart: function(state) {
      jb.assert(!this.smCurrentState, "State machine already started!");
      jb.assert(jb.stateMachines.updating.indexOf(this) < 0, "State machine already in update list!");

      this.smAllowStateChange = true;
      this.stateMachineSetNextState(state);
      this.smAllowStateChange = false;

      if (jb.stateMachines.toAdd.indexOf(this) < 0) {
          jb.stateMachines.toAdd.push(this);
      }
  },

  stateMachineSetNextState: function(nextState) {
      jb.assert(this.smAllowStateChange, "Illegal state change in state machine!");

      if (this.smCurrentState != nextState) {
          this.smNextState = nextState;
      }
  },

  stateMachineIsInState: function(testState) {
      return testState === this.smCurrentState;
  },

  stateMachineStop: function() {
      jb.assert(this.smCurrentState, "State machine already stopped");
      jb.assert(jb.stateMachines.updating.indexOf(this) >= 0, "State machine not in update list!");

      if (jb.stateMachines.toRemove.indexOf(this) < 0) {
          jb.stateMachines.toRemove.push(this);
      }
  }
};

blueprints.mixins["stateMachine"] = jb.stateMachines;

///////////////////////////////////////////////////////////////////////////////
// Body2D
///////////////////////////////////////////////////////////////////////////////
jb.body2d = {
  allBodies: [],
  debug: false,
  timeScale: 1.0,

  makeInstance: function(instance) {
      if (!instance.bounds) {
          instance.bounds = new jb.bounds(0, 0, 0, 0);
      }

      instance.body2dInfo = {
          gravity: 0.0,
          timeScale: {
              x: 1.0,
              y: 1.0
          },
          velocity: {
              x: 0,
              y: 0
          },
          acceleration: {
              x: 0,
              y: 0
          },
          deltaPos: {
              x: 0,
              y: 0
          },
          drag: {
              x: 0,
              y: 0
          },
          mass: 1.0,
      }
  },

  // Blueprint Interface //////////////////////////////////////////////////////
  spawn: function(instance) {
      jb.body2d.makeInstance(instance);
      jb.body2d.allBodies.push(instance);
  },

  destroy: function(instance) {
      jb.removeFromArray(jb.body2d.allBodies, instance);
  },

  // Mixins ///////////////////////////////////////////////////////////////////
  body2dUpdate: function(dtMS) {
      var dt = dtMS * 0.001 * jb.body2d.timeScale;

      var dvx = this.body2dInfo.acceleration.x * dt * this.body2dInfo.timeScale.x;
      var dvy = (this.body2dInfo.acceleration.y + this.body2dInfo.gravity) * dt * this.body2dInfo.timeScale.y;

      var vAveX = (this.body2dInfo.velocity.x + dvx) * 0.5;
      var vAveY = (this.body2dInfo.velocity.y + dvy) * 0.5;

      // Compute approximate effect of drag.
      var dragX = -vAveX * this.body2dInfo.drag.x * dt;
      var dragY = -vAveY * this.body2dInfo.drag.y * dt;

      if (Math.abs(dragX) > Math.abs(vAveX)) dragX = -vAveX;
      if (Math.abs(dragY) > Math.abs(vAveY)) dragY = -vAveY;

      vAveX += dragX;
      vAveY += dragY;

      this.body2dInfo.deltaPos.x = vAveX * dt;
      this.body2dInfo.deltaPos.y = vAveY * dt;

      // Compute final velocity.
      this.body2dInfo.velocity.x = 2.0 * vAveX;
      this.body2dInfo.velocity.y = 2.0 * vAveY;

      this.bounds.moveBy(this.body2dInfo.deltaPos.x, this.body2dInfo.deltaPos.y);
  },
};

blueprints.mixins["body2d"] = jb.body2d;

///////////////////////////////////////////////////////////////////////////////
// Sprites
///////////////////////////////////////////////////////////////////////////////
// Sprites are (possibly) animated images that reference image resources.
// Usage (deprecated):
// jb.sprites.create(spriteSheet, x, y, [states], [startState], [anchorX], [anchorY]);
// Where spriteSheet is a spriteSheet reference,
//   anchorX and anchorY are floating point offsets for the sprite's origin
//   states is an object containing arrays of frame indeces into the source
//     spriteSheet, for example:
//     {
//       idle:[0],
//       run: [1, 2]
//       event: "eventName" (optional)
//     }
jb.sprites = {
  allSprites: [],
  debug: false,

  createState: function(frames, frameDt, bReset) {
      var newState = {
          frames: frames || [], // array of {row: n, col: m} objects
          frameDt: frameDt || 0,
          bReset: bReset || true,
          frameIndex: 0,
          events: []
      };

      for (var i = 0; i < frames.length; ++i) {
          if (frames[i].hasOwnProperty("event")) {
              newState.events.push(frames[i].event);
          } else {
              newState.events.push(null);
          }
      }

      return newState;
  },

  makeInstance: function(instance) {
      if (!instance.bounds) {
          instance.bounds = new jb.bounds(0, 0, 0, 0);
      }

      if (!instance.alpha) {
          instance.alpha = 1.0;
      }

      instance.spriteInfo = {
          sheet: null,
          states: {},
          frameTime: 0.0,
          anchor: {
              x: 0.0,
              y: 0.0
          },
          state: null,
          scale: {
              x: 1.0,
              y: 1.0
          },
          bVisible: true,
          rotation: 0,
          debugColor: "yellow",
      };
  },

  // Blueprint Interface //////////////////////////////////////////////////////
  spawn: function(instance) {
      jb.sprites.makeInstance(instance);
      this.allSprites.push(instance);
  },

  destroy: function(instance) {
      jb.removeFromArray(this.allSprites, instance);
  },

  // Mixins ///////////////////////////////////////////////////////////////////
  /**
   * Sets a sprite's image source to a TileSheetObject.
   * @param {jb.TileSheetObj} newSheet 
   */
  spriteSetSheet: function(newSheet) {
      this.spriteInfo.sheet = newSheet

      if (this.spriteInfo.sheet) {
          this.bounds.resizeTo(this.spriteInfo.sheet.cellDx * jb.viewScale, this.spriteInfo.sheet.cellDy * jb.viewScale);
      }
  },

  spriteAddStates: function(stateObj) {
      var key = null;

      for (key in stateObj) {
          this.spriteInfo.states[key] = JSON.parse(JSON.stringify(stateObj[key]));
      }
  },

  spriteHide: function() {
      this.spriteInfo.bVisible = false;
  },

  spriteCollidesWith: function(other) {
      return this.bounds.overlap(other.bounds);
  },

  spriteShow: function() {
      this.spriteInfo.bVisible = true;
  },

  spriteSetRotation: function(angleInDegrees) {
      this.spriteInfo.rotation = angleInDegrees;
  },

  spriteSetAnchor: function(x, y) {
      this.spriteInfo.anchor.x = x === undefined ? 0.5 : x;
      this.spriteInfo.anchor.y = y === undefined ? 0.5 : y;
  },

  spriteSetDebugColor: function(newColor) {
      this.spriteInfo.debugColor = newColor;
  },

  spriteSetScale: function(sx, sy) {
      this.spriteInfo.scale.x = sx === undefined ? 1.0 : sx;
      this.spriteInfo.scale.y = sy === undefined ? 1.0 : sy;

      if (this.bounds) {
          // Reset dimensions to original value to prevent subsequent "scale" calls
          // from working off the previously-scaled values.
          this.bounds.w = this.spriteInfo.sheet.cellDx * jb.viewScale;
          this.bounds.h = this.spriteInfo.sheet.cellDy * jb.viewScale;
          this.bounds.scale(sx, sy, this.spriteInfo.anchor.x, this.spriteInfo.anchor.y);
      }
  },

  spriteAddState: function(newStateName, newState) {
      if (newStateName && newState) {
          this.spriteInfo.states[newStateName] = newState;
          this.spriteInfo.state = newState;
      }
  },

  spriteGetCurrentFrameCount: function() {
      return this.spriteInfo.state && this.spriteInfo.state.frames ? this.spriteInfo.state.frames.length : 0;
  },

  spriteSetStates: function(states) {
      this.spriteInfo.states = states;
  },

  spriteRandomizeAnimation: function() {
      if (this.spriteInfo.state) {
          this.spriteInfo.frameTime += Math.round(Math.random() * this.spriteInfo.state.frameDt);
      }
  },

  spriteMoveTo: function(x, y) {
      this.bounds.l = Math.round(x * jb.viewScale - this.spriteInfo.anchor.x * this.bounds.w);
      this.bounds.t = Math.round(y * jb.viewScale - this.spriteInfo.anchor.y * this.bounds.h);
  },

  spriteMoveBy: function(dx, dy) {
      this.bounds.l += dx * jb.viewScale;
      this.bounds.t += dy * jb.viewScale;
  },

  spriteSetState: function(newState) {
      var param = 0,
          curState = this.spriteInfo.state,
          newState = this.spriteInfo.states[newState];

      if (newState && newState !== curState) {
          // If no state is currently defined, use the new state.
          if (!curState) {
              this.spriteInfo.state = newState;
          }

          if (newState === curState || newState.bReset || !curState) {
              // If we're resetting, or re-entering, or didn't have a previous state,
              // initialize to the start of the state.
              this.spriteInfo.state.frameIndex = 0;
              this.spriteInfo.frameTime = 0.0;
              this.spriteInfo.lastFrame = -1;
          } else if (newState) {
              // Figure out where we are in the frames of the
              // current state and advance that far into the
              // frames of the new state.
              newState.frameIndex = Math.floor(curState.frameIndex / curState.frames.length * newState.frames.length);
              this.spriteInfo.frameTime = this.spriteInfo.frameTime * newState.frameDt / curState.frameDt;
              newState.frameIndex = curState.frameIndex;
              this.spriteInfo.lastFrame = newState.frameIndex - 1;
          }
      }

      this.spriteInfo.state = newState;
  },

  spriteResetTimer: function() {
      this.spriteInfo.frameTime = 0.0;
      this.spriteInfo.lastFrame = -1;
      for (var i = 0; i < this.spriteInfo.states.length; ++i) {
          var state = this.spriteInfo.states[i];
          state.frameIndex = 0;
      }
  },

  spriteSetAlpha: function(newAlpha) {
      this.alpha = Math.max(0.0, newAlpha);
      this.alpha = Math.min(newAlpha, 1.0);
  },

  spriteUpdate: function(dt) {
      var curState = this.spriteInfo.state,
          framesPassed = 0;

      if (curState) {
          if (curState.frameDt > 0.0) {
              this.spriteInfo.frameTime += dt;

              while (this.spriteInfo.frameTime >= curState.frameDt) {
                  this.spriteInfo.frameTime -= curState.frameDt;
                  curState.frameIndex += 1;
                  curState.frameIndex %= curState.frames.length;

                  if (curState.events && curState.events.length > curState.frameIndex && curState.events[curState.frameIndex] && curState.lastFrame !== curState.frameIndex) {
                      var eventName = curState.events[curState.frameIndex];
                      if (typeof(this[eventName]) === "function") {
                          this[eventName](curState);
                      }
                  }

                  curState.lastFrame = curState.frameIndex;
              }
          }
      }
  },

  spriteDraw: function(ctxt) {
      if (this.spriteInfo.bVisible && this.spriteInfo.state && this.spriteInfo.state.frames.length > this.spriteInfo.state.frameIndex && this.spriteInfo.sheet && this.alpha > 0.0) {
          var destX = 0,
              destY = 0,
              oldAlpha = ctxt.globalAlpha,
              frameInfo = null;

          destX = this.bounds.l / jb.viewScale;
          destY = this.bounds.t / jb.viewScale;

          ctxt.globalAlpha = this.alpha;

          frameInfo = this.spriteInfo.state.frames[this.spriteInfo.state.frameIndex];
          this.spriteInfo.sheet.drawVirtualTile(ctxt, destX, destY, frameInfo.row, frameInfo.col, 0, 0, this.spriteInfo.scale.x, this.spriteInfo.scale.y, this.spriteInfo.rotation);

          ctxt.globalAlpha = oldAlpha;

          // DEBUG ////////////////////////
          if (jb.sprites.debug && this.bounds) {
              this.bounds.draw(this.spriteInfo.debugColor, jb.ctxt);
          }
          // END DEBUG ////////////////////
      }
  }
};

blueprints.mixins["sprite"] = jb.sprites;

///////////////////////////////////////////////////////////////////////////////
// Transitions ----------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////
jb.transitions = {
  // Blueprint Interface //////////////////////////////////////////////////////
  transitioners: [],

  spawn: function(instance) {
      jb.transitions.makeInstance(instance);
      this.transitioners.push(instance);
  },

  destroy: function(instance) {
      jb.removeFromArray(this.transitioners, instance);
  },

  // 'Transitions' Interface //////////////////////////////////////////////////
  makeInstance: function(instance) {
      if (typeof instance.transitions === "undefined") {
          instance.transitions = [];
      }

      if (typeof instance.transitionStates === "undefined") {
          instance.transitionStates = {};
      }
  },

  transitionState: function(tStart, tEnd, tNow, duration, fnUpdate, fnFinalize) {
      this.reset = function(tStart, tEnd, tNow, duration, fnUpdate, fnFinalize) {
          this.tStart = tStart;
          this.tEnd = tEnd;
          this.tNow = tNow;
          this.duration = Math.max(duration, 1);
          this.update = fnUpdate;
          this.finalize = fnFinalize;
          this.bActive = false;
      }
  },

  update: function() {
      var iTransitioner = 0,
          param = 0,
          transitioner = null;

      for (iTransitioner = 0; iTransitioner < this.transitioners.length; ++iTransitioner) {
          transitioner = this.transitioners[iTransitioner];
          if (transitioner !== null) {
              transitioner.transitionerUpdate.apply(transitioner);
          }
      }
  },

  isTransitioning: function() {
      var i = 0,
          bTransitioning = false;

      for (i = 0; i < this.transitioners.length; ++i) {
          if (this.transitioners[i] && this.transitioners[i].transitionerCountActiveTransitions() > 0) {
              bTransitioning = true;
              break;
          }
      }

      return bTransitioning;
  },

  // Mixins -------------------------------------------------------------------
  // All mixins must start with the prefix 'transitions' in order to be added
  // to the instance's prototype.

  bDoUpdate: true, // DEBUG: set to 'false' to disable update look. Useful for debugging infinite loops.

  transitionerUpdate: function() {
      var param = 0,
          dt = jb.time.deltaTimeMS,
          timeUsed = 0,
          curState = this.transitions[0];

      while (jb.transitions.bDoUpdate && dt > 0 && this.transitions.length > 0 && curState) {
          curState.bActive = true;
          timeUsed = Math.min(dt, curState.tEnd - curState.tNow);
          dt -= timeUsed;
          curState.tNow += timeUsed;
          param = Math.min(1.0, (curState.tNow - curState.tStart) / curState.duration);

          curState.update(param);

          if (Math.abs(param - 1.0) < jb.EPSILON) {
              this.transitionerFinalizeCurrent();
          }

          curState = this.transitions[0];
      }
  },

  transitionerCountActiveTransitions: function() {
      return this.transitions.length;
  },

  transitionerParamToEaseInOut: function(param) {
      var easedParam = (1.0 + Math.sin(-Math.PI * 0.5 + Math.PI * param)) * 0.5;
      return easedParam * easedParam;
  },

  transitionerAdd: function(name, duration, fnUpdate, fnFinalize, bReset) {
      var newTransition = null,
          tStart = 0,
          curParam = 0;

      duration *= 1000;

      // See if this transition state already exists for us.    
      newTransition = this.transitionStates[name];

      if (!newTransition) {
          // No previous
          newTransition = new jb.transitions.transitionState()
          bReset = true;
      }

      if (!newTransition.bActive || bReset) {
          // Old transition finished or we're resetting it.
          newTransition.reset(jb.time.now, jb.time.now + duration, jb.time.now, duration, fnUpdate.bind(this), fnFinalize.bind(this));
      } else {
          // Old transition exists and is still active.
          // Figure out where we should start the new transition. If we're
          // already tracking a transitionState of this type, we should
          // start where the last one left off.
          curParam = (newTransition.tNow - newTransition.tStart) / newTransition.duration;
          newTransition.tEnd = newTransition.tNow + (1 - curParam) * duration;
          newTransition.reset(newTransition.tNow - curParam * duration, newTransition.tEnd, newTransition.tNow, duration, update.bind(this), finalize.bind(this));
      }

      this.transitions.push(newTransition);
      this.transitionStates[name] = newTransition;
  },

  transitionerFinalizeCurrent: function() {
      if (this.transitions[0]) {
          this.transitions[0].finalize();
          this.transitions[0].bActive = false;
          this.transitionStates[this.transitions[0].name] = null;
          this.transitions.shift();
      }
  },

  transitionerFinalizeAll: function() {
      var i = 0;

      while (this.transitions.length) {
          this.transitionerFinalizeCurrent();
      }
  }
};

blueprints.mixins["transitioner"] = jb.transitions;

///////////////////////////////////////////////////////////////////////////////
// Touchables -----------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////
jb.touchables = {
  // Blueprint Interface ////////////////////////////////////////////////////
  spawn: function(instance) {
      jb.touchables.makeInstance(instance);
      jb.touchables.instances.unshift(instance);
  },

  destroy: function(instance) {
      var index = jb.touchables.instances.indexOf(instance);

      // Remove the instance from the instances array.
      // TODO: replace 'splice' with an optimizable function.
      if (index >= 0) {
          jb.touchables.instances.splice(index, 1);
      }
  },

  // 'Touchables' Implementation ////////////////////////////////////////////
  instances: [],

  makeInstance: function(instance) {
      if (!instance.bounds) {
          instance.bounds = new jb.bounds(0, 0, 0, 0);
      }

      if (!instance.touchLayer) {
          instance.touchLayer = 0;
      }

      if (!instance.onTouched) {
          instance.onTouched = null;
      }

      if (!instance.onUntouched) {
          instance.onUntouched = null;
      }

      instance.bTouchableEnabled = true;
  },

  getTouched: function(screenX, screenY) {
      var i,
          touched = null,
          x = jb.screenToWorldX(screenX),
          y = jb.screenToWorldY(screenY);

      for (i = jb.touchables.instances.length - 1; i >= 0; --i) {
          if (jb.touchables.instances[i].bTouchableEnabled && jb.touchables.instances[i].bounds.contain(x, y)) {
              touched = jb.touchables.instances[i];
              if (touched.onTouched) {
                  touched.onTouched.call(touched, screenX, screenY);
              }
              break;
          }
      }

      return touched;
  },

  // Mixins ---------------------------------------------
  // All "mixin" functions must start with the prefix
  // "touchable" in order to flag their inclusion into
  // the specified prototypes.
  // e.g.:
  //     touchableGetLayer: function() { .. },
  touchableSetLayer: function(newLayer) {
      if (jb.touchables.instances.indexOf(this) >= 0) {
          jb.removeFromArray(jb.touchables.instances, this, true);
      }

      this.touchLayer = Math.max(0, newLayer);

      for (i = 0; i < jb.touchables.instances.length; ++i) {
          if (instance.touchLayer <= jb.touchables.instances[i].touchLayer) {
              // Insert the instance at this point.
              // TODO: replace 'splice' with an optimizable function.                
              jb.touchables.splice(i, 0, instance);
              bInserted = true;
              break;
          }
      }

      if (!bInserted) {
          jb.touchables.instances.push(instance);
      }
  },

  touchableEnable: function() {
      this.bTouchableEnabled = true;
  },

  touchableDisable: function() {
      this.bTouchabelDisabled = false;
  }
};

blueprints.mixins["touchable"] = jb.touchables;

///////////////////////////////////////////////////////////////////////////////
// Swipeables -----------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////
jb.swipeables = {
  // Blueprint Interface ////////////////////////////////////////////////////
  spawn: function(instance) {
      var i = 0,
          bInserted = false;

      jb.swipeables.makeInstance(instance);

      if (!bInserted) {
          jb.swipeables.instances.push(instance);
      }
  },

  destroy: function(instance) {
      var index = jb.swipeables.instances.indexOf(instance);

      // Remove the instance from the instances array.
      // TODO: replace 'splice' with an optimizable function.
      if (index >= 0) {
          jb.swipeables.instances.splice(index, 1);
      }
  },

  // 'Swipeables' Implementation ////////////////////////////////////////////
  instances: [],

  makeInstance: function(instance) {
      if (!instance.bounds) {
          instance.bounds = new jb.bounds(0, 0, 0, 0);
      }

      instance.touchLayer = 0;
      instance.bSwipeableEnabled = true;

      if (!instance.onTouched) {
          instance.onTouched = null;
      }

      if (!instance.onUntouched) {
          instance.onUntouched = null;
      }
  },

  getSwiped: function() {
      var i,
          swiped = null,
          sx = jb.screenToWorldX(jb.swipe.lastX),
          sy = jb.screenToWorldY(jb.swipe.lastY),
          ex = jb.screenToWorldX(jb.swipe.endX),
          ey = jb.screenToWorldY(jb.swipe.endY);

      jb.swipe.allSwiped.length = 0;

      for (i = jb.swipeables.instances.length - 1; i >= 0; --i) {
          if (jb.swipeables.instances[i].bSwipeableEnabled && (jb.swipeables.instances[i].bounds.intersectLine(sx, sy, ex, ey))) {
              swiped = jb.swipeables.instances[i];

              jb.swipe.allSwiped.push(swiped);

              if (jb.swipe.swiped.indexOf(swiped) < 0) {
                  jb.swipe.swiped.push(swiped);

                  if (swiped.onSwiped) {
                      swiped.onSwiped.call(swiped);
                  }
              }
          }
      }
  },

  // Mixins ---------------------------------------------
  // All "mixin" functions must start with the prefix
  // "swipeable" in order to flag their inclusion into
  // the specified prototypes.
  // e.g.:
  //     swipeableGetLayer: function() { .. },
  swipeableSetLayer: function(newLayer) {
      if (jb.swipeables.instances.indexOf(this) >= 0) {
          jb.removeFromArray(jb.swipeables.instances, this, true);
      }

      this.swipeLayer = Math.max(0, newLayer);

      for (i = 0; i < jb.swipeables.instances.length; ++i) {
          if (instance.swipeLayer <= jb.swipeables.instances[i].swipeLayer) {
              // Insert the instance at this point.
              // TODO: replace 'splice' with an optimizable function.                
              jb.swipeables.splice(i, 0, instance);
              bInserted = true;
              break;
          }
      }

      if (!bInserted) {
          jb.swipeables.instances.push(instance);
      }
  },

  swipeableEnable: function() {
      this.bSwipeableEnabled = true;
  },

  swipeableDisable: function() {
      this.bSwipeableEnabled = false;
  }
};

blueprints.mixins["swipeable"] = jb.swipeables;

/////////////////////////////////////////////////////////////////////////////////////////////
// ooooo   ooooo oooooooooooo ooooo        ooooooooo.   oooooooooooo ooooooooo.    .oooooo.o 
// `888'   `888' `888'     `8 `888'        `888   `Y88. `888'     `8 `888   `Y88. d8P'    `Y8 
//  888     888   888          888          888   .d88'  888          888   .d88' Y88bo.      
//  888ooooo888   888oooo8     888          888ooo88P'   888oooo8     888ooo88P'   `"Y8888o.  
//  888     888   888    "     888          888          888    "     888`88b.         `"Y88b 
//  888     888   888       o  888       o  888          888       o  888  `88b.  oo     .d8P 
// o888o   o888o o888ooooood8 o888ooooood8 o888o        o888ooooood8 o888o  o888o 8""88888P'  
// Helpers //////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// tileSheet Object
///////////////////////////////////////////////////////////////////////////////
jb.tileSheetObj = function(source, cellDx, cellDy, left, top, rows, cols) {
  this.source = source;
  this.top = top || 0;
  this.left = left || 0;
  this.rows = rows || Math.floor((source.height + cellDy - 1) / cellDy);
  this.cols = cols || Math.floor((source.width + cellDx - 1) / cellDx);
  this.cellDx = cellDx;
  this.cellDy = cellDy;
};

jb.tileSheetObj.prototype.drawStart = function(ctxt, destX, destY, anchorX, anchorY, scaleX, scaleY, rotation) {
  var offsetX = 0,
      offsetY = 0,
      dx = 0,
      dy = 0;

  ctxt.save();

  rotation = -rotation || 0;
  rotation = Math.PI * rotation / 180.0;
  scaleX = scaleX || 1;
  scaleY = scaleY || 1;
  anchorX = anchorX || 0;
  anchorY = anchorY || 0;

  scaleX *= jb.viewScale;
  scaleY *= jb.viewScale;

  offsetX = Math.round(this.cellDx * (-anchorX + 0.0) * Math.abs(scaleX));
  offsetY = Math.round(this.cellDy * (-anchorY + 0.0) * Math.abs(scaleY));

  dx = Math.round(destX + offsetX);
  dy = Math.round(destY + offsetY);

  ctxt.translate(dx, dy);

  if (Math.abs(scaleX - 1.0) > jb.EPSILON || Math.abs(scaleY - 1.0) > jb.EPSILON) {
      ctxt.scale(scaleX, scaleY);
  }

  if (Math.abs(rotation) > jb.EPSILON) {
      ctxt.rotate(rotation);
  }
};

jb.tileSheetObj.prototype.drawEnd = function(ctxt) {
  ctxt.restore();
};

jb.tileSheetObj.prototype.draw = function(ctxt, cellRow, cellCol, destX, destY, anchorX, anchorY, scaleX, scaleY, rotation) {
  this.drawStart(ctxt, destX, destY, anchorX, anchorY, scaleX, scaleY, rotation);
  this.batchDraw(ctxt, cellRow, cellCol, destX, destY, anchorX, anchorY, scaleX, scaleY);
  this.drawEnd(ctxt);
};

jb.tileSheetObj.prototype.batchDraw = function(ctxt, cellRow, cellCol, destX, destY, anchorX, anchorY, scaleX, scaleY) {
  destX = destX || 0;
  destY = destY || 0;
  anchorX = anchorX || 0;
  anchorY = anchorY || 0;
  scaleX = scaleX || 1;
  scaleY = scaleY || 1;

  scaleX *= jb.viewScale;
  scaleY *= jb.viewScale;

  // var x = Math.round(this.cellDx * -0.5 * jb.viewScale * Math.abs(scaleX));
  // var y = Math.round(this.cellDy * -0.5 * jb.viewScale * Math.abs(scaleY));

  ctxt.drawImage(this.source,
      this.left + cellCol * this.cellDx - 0.25 / scaleX, // 0.25 / scaleX -> HACK to prevent anti-aliasing from adding extra pixels when drawing a scaled sprite.
      this.top + cellRow * this.cellDy + 0.25 / scaleY, // 0.25 / scaleY -> HACK to prevent anti-aliasing from adding extra pixels when drawing a scaled sprite.
      this.cellDx,
      this.cellDy,
      0,
      0,
      Math.round(this.cellDx),
      Math.round(this.cellDy));
};

jb.tileSheetObj.prototype.drawVirtualTile = function(ctxt, left, top, cellRow, cellCol, anchorX, anchorY, scaleX, scaleY, rotation) {
  ctxt.save();

  left *= jb.viewScale;
  top *= jb.viewScale;

  anchorX = anchorX === null ? 0.5 : anchorX;
  anchorY = anchorY === null ? 0.5 : anchorY;

  scaleX = scaleX || 1;
  scaleY = scaleY || 1;

  rotation = rotation || 0;

  scaleX *= jb.viewScale;
  scaleY *= jb.viewScale;

  var x = Math.round(left + (-anchorX + 0.5) * this.cellDx * Math.abs(scaleX));
  var y = Math.round(top + (-anchorY + 0.5) * this.cellDy * Math.abs(scaleY));

  ctxt.translate(x, y);
  ctxt.scale(scaleX, scaleY);
  ctxt.rotate(rotation * Math.PI / 180);

  ctxt.drawImage(this.source,
      cellCol * this.cellDx - 0.25 / scaleX, // 0.25 / scaleX -> HACK to prevent anti-aliasing from adding extra pixels when drawing a scaled sprite.
      cellRow * this.cellDy + 0.25 / scaleY, // 0.25 / scaleY -> HACK to prevent anti-aliasing from adding extra pixels when drawing a scaled sprite.
      this.cellDx,
      this.cellDy,
      -0.5 * this.cellDx,
      -0.5 * this.cellDy,
      this.cellDx,
      this.cellDy);

  ctxt.restore();
}

jb.tileSheetObj.prototype.getCellWidth = function() {
  return this.cellDx;
};

jb.tileSheetObj.prototype.getCellHeight = function() {
  return this.cellDy;
};

jb.tileSheetObj.prototype.getNumCells = function() {
  return this.rows * this.cols;
};

///////////////////////////////////////////////////////////////////////////////
// Array Utilities
///////////////////////////////////////////////////////////////////////////////
jb.removeFromArray = function(theArray, theElement, bPreserveOrder) {
  var index = theArray.indexOf(theElement);

  if (index >= 0) {
      if (!bPreserveOrder) {
          theArray[index] = theArray[theArray.length - 1];
          theArray.length -= 1;
      } else {
          theArray.splice(index, 1);
      }
  }
};

jb.randomizeArray = function(array) {
  var i = 0,
      temp = null,
      index = 0;

  if (array) {
      for (i = 0; i < array.length; ++i) {
          index = Math.floor(Math.random() * (array.length - i));
          temp = array[index];
          array[index] = array[array.length - i - 1];
          array[array.length - i - 1] = temp;
      }
  }
};

jb.popRandom = function(array, preserveOrder) {
  var element = array[Math.floor(Math.random() * array.length)];

  jb.removeFromArray(array, element, preserveOrder);

  return element;
};

///////////////////////////////////////////////////////////////////////////////
// requestAnimationFrame
///////////////////////////////////////////////////////////////////////////////
// http://paulirish.com/2031/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2031/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
          window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = window.setTimeout(function() {
                  callback(currTime + timeToCall);
              },
              timeToCall);
          lastTime = currTime + timeToCall;
          return id;
      };

  if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
          clearTimeout(id);
      };
}());

///////////////////////////////////////////////////////////////////////////////
// ooo        ooooo       .o.       ooooooooooooo ooooo   ooooo 
// `88.       .888'      .888.      8'   888   `8 `888'   `888' 
//  888b     d'888      .8"888.          888       888     888  
//  8 Y88. .P  888     .8' `888.         888       888ooooo888  
//  8  `888'   888    .88ooo8888.        888       888     888  
//  8    Y     888   .8'     `888.       888       888     888  
// o8o        o888o o88o     o8888o     o888o     o888o   o888o 
// Math ///////////////////////////////////////////////////////////////////////
jb.MathEx = {};

jb.MathEx.linesIntersect = function(x11, y11, x12, y12, x21, y21, x22, y22) {
  var vx1121 = x21 - x11, // First point in segment 1 to first point in segment 2, x-coord.
      vy1121 = y21 - y11, // First point in segment 1 to first point in segment 2, y-coord.
      vx1122 = x22 - x11, // First point in segment 1 to second point in segment 2, x-coord.
      vy1122 = y22 - y11, // First point in segment 1 to second point in segment 2, y-coord.
      c1 = vx1121 * vy1122 - vx1122 * vy1121,
      vx1221 = x21 - x12, // Second point in segment 1 to first point in segment 2, x-coord.
      vy1221 = y21 - y12, // Second point in segment 1 to first point in segment 2, y-coord.
      vx1222 = x22 - x12, // Second point in segment 1 to second point in segment 2, x-coord.
      vy1222 = y22 - y12, // Second point in segment 1 to second point in segment 2, y-coord.
      c2 = vx1221 * vy1222 - vx1222 * vy1221,
      c3 = 1,
      c4 = 1;

  if (c1 * c2 <= 0.0) {
      c3 = vx1121 * vy1221 - vy1121 * vx1221;
      c4 = vx1122 * vy1222 - vy1122 * vx1222;
  }

  return c3 * c4 <= 0.0;
};

jb.MathEx.zeroNorm = function(dx, dy) {
  return Math.max(Math.abs(dx), Math.abs(dy));
};

jb.MathEx.oneNorm = function(dx, dy) {
  return Math.abs(dx) + Math.abs(dy);
};

jb.MathEx.twoNorm = function(dx, dy) {
  return Math.round(Math.sqrt(dx * dx + dy * dy));
};

jb.MathEx.sign = function(x) {
  return x > 0 ? 1 : (x < 0 ? -1 : 0);
};

jb.MathEx.bresenhamInterp = function(x1, y1, x2, y2, step, current) {
  var dx = x2 - x1,
      dy = y2 - y1,
      absDx = Math.abs(dx),
      absDy = Math.abs(dy),
      curDx = Math.abs(current.x - x1),
      curDy = Math.abs(current.y - y1),
      modFactor = 0,
      nextDx = 0,
      nextDy = 0,
      progX = 0,
      progY = 0,
      doModX = false;

  if (absDx === absDy) {
      doModX = curDx < curDy;
  } else if (absDx === 0) {
      doModX = false;
  } else if (absDy === 0) {
      doModX = true;
  } else {
      absDx += 1;
      absDy += 1;
      curDx += 1;
      curDy += 1;

      nextDx = Math.abs(current.x + jb.MathEx.sign(dx) - x1);
      nextDy = Math.abs(current.y + jb.MathEx.sign(dy) - y1);
      progX = nextDx / absDx;
      progY = nextDy / absDy;

      if (progX === progY) {
          doModX = curDx / absDx < curDy / absDy;
      } else {
          doModX = progX < progY;
      }
  }

  if (doModX) {
      current.x += jb.MathEx.sign(dx);
  } else {
      current.y += jb.MathEx.sign(dy);
  }
};

jb.MathEx.simpleInterp2d = function(x1, y1, x2, y2, step, result) {
  var dx = x2 - x1,
      dy = y2 - y1,
      isMaxX = Math.abs(dx) > Math.abs(dy),
      stepX = isMaxX ? jb.MathEx.sign(dx) : dx / Math.abs(dy),
      stepY = isMaxX ? dy / Math.abs(dx) : jb.MathEx.sign(dy);

  if (result) {
      result.x = Math.floor(x1 + stepX * step);
      result.y = Math.floor(y1 + stepY * step);
  }
};

// Cubic Splines --------------------------------------------------------------
jb.MathEx.cubic = function(a, b, c, d, u) {
  this.a = a;
  this.b = b;
  this.c = c;
  this.d = d;
};

jb.MathEx.cubic.prototype.getValueAt = function(u) {
  return (((this.d * u) + this.c) * u + this.b) * u + this.a;
};

jb.MathEx.calcNaturalCubic = function(values, component, cubics) {
  var num = values.length - 1;
  var gamma = []; // new float[num+1];
  var delta = []; // new float[num+1];
  var D = []; // new float[num+1];
  var i = 0;

  /*
       We solve the equation
      [2 1       ] [D[0]]   [3(x[1] - x[0])  ]
      |1 4 1     | |D[1]|   |3(x[2] - x[0])  |
      |  1 4 1   | | .  | = |      .         |
      |    ..... | | .  |   |      .         |
      |     1 4 1| | .  |   |3(x[n] - x[n-2])|
      [       1 2] [D[n]]   [3(x[n] - x[n-1])]
      
      by using row operations to convert the matrix to upper triangular
      and then back sustitution.  The D[i] are the derivatives at the knots.
  */
  gamma.push(1.0 / 2.0);
  for (i = 1; i < num; i++) {
      gamma.push(1.0 / (4.0 - gamma[i - 1]));
  }
  gamma.push(1.0 / (2.0 - gamma[num - 1]));

  p0 = values[0][component];
  p1 = values[1][component];

  delta.push(3.0 * (p1 - p0) * gamma[0]);
  for (i = 1; i < num; i++) {
      p0 = values[i - 1][component];
      p1 = values[i + 1][component];
      delta.push((3.0 * (p1 - p0) - delta[i - 1]) * gamma[i]);
  }
  p0 = values[num - 1][component];
  p1 = values[num][component];

  delta.push((3.0 * (p1 - p0) - delta[num - 1]) * gamma[num]);

  D.unshift(delta[num]);
  for (i = num - 1; i >= 0; i--) {
      D.unshift(delta[i] - gamma[i] * D[0]);
  }

  /*
       now compute the coefficients of the cubics 
  */
  cubics.length = 0;

  for (i = 0; i < num; i++) {
      p0 = values[i][component];
      p1 = values[i + 1][component];

      cubics.push(new jb.MathEx.cubic(
          p0,
          D[i],
          3 * (p1 - p0) - 2 * D[i] - D[i + 1],
          2 * (p0 - p1) + D[i] + D[i + 1]
      ));
  }
};

jb.MathEx.Spline2D = function() {
  this.points = [];
  this.xCubics = [];
  this.yCubics = [];
};

jb.MathEx.Spline2D.prototype.reset = function() {
  this.points.length = 0;
  this.xCubics.length = 0;
  this.yCubics.length = 0;
};

jb.MathEx.Spline2D.prototype.addPoint = function(point) {
  this.points.push(point);
};

jb.MathEx.Spline2D.prototype.getPoints = function() {
  return this.points;
};

jb.MathEx.Spline2D.prototype.calcSpline = function() {
  jb.MathEx.calcNaturalCubic(this.points, "x", this.xCubics);
  jb.MathEx.calcNaturalCubic(this.points, "y", this.yCubics);
};

jb.MathEx.Spline2D.prototype.getPoint = function(position) {
  position = position * this.xCubics.length; // extrapolate to the arraysize

  var cubicNum = Math.floor(position);
  var cubicPos = (position - cubicNum);

  return {
      x: this.xCubics[cubicNum].getValueAt(cubicPos),
      y: this.yCubics[cubicNum].getValueAt(cubicPos)
  };
};

jb.MathEx.Spline3D = function() {
  this.points = [];
  this.xCubics = [];
  this.yCubics = [];
  this.zCubics = [];
};

jb.MathEx.Spline3D.prototype.reset = function() {
  this.points.length = 0;
  this.xCubics.length = 0;
  this.yCubics.length = 0;
  this.zCubics.length = 0;
};

jb.MathEx.Spline3D.prototype.addPoint = function() {
  this.points.push(point);
};

jb.MathEx.Spline3D.prototype.getPoints = function() {
  return this.points;
};

jb.MathEx.Spline3D.prototype.calcSpline = function() {
  jb.MathEx.calcNaturalCubic(this.points, "x", this.xCubics);
  jb.MathEx.calcNaturalCubic(this.points, "y", this.yCubics);
  jb.MathEx.calcNaturalCubic(this.points, "z", this.zCubics);
};

jb.MathEx.Spline3D.prototype.getPoint = function(position) {
  position = position * this.xCubics.length; // extrapolate to the arraysize

  var cubicNum = Math.floor(position);
  var cubicPos = (position - cubicNum);

  return {
      x: this.xCubics[cubicNum].getValueAt(cubicPos),
      y: this.yCubics[cubicNum].getValueAt(cubicPos),
      z: this.zCubics[cubicNum].getValueAt(cubicPos)
  };
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ooo        ooooo oooooooooooo  .oooooo..o  .oooooo..o       .o.         .oooooo.    oooooooooooo  .oooooo..o      
// `88.       .888' `888'     `8 d8P'    `Y8 d8P'    `Y8      .888.       d8P'  `Y8b   `888'     `8 d8P'    `Y8      
//  888b     d'888   888         Y88bo.      Y88bo.          .8"888.     888            888         Y88bo.           
//  8 Y88. .P  888   888oooo8     `"Y8888o.   `"Y8888o.     .8' `888.    888            888oooo8     `"Y8888o.       
//  8  `888'   888   888    "         `"Y88b      `"Y88b   .88ooo8888.   888     ooooo  888    "         `"Y88b      
//  8    Y     888   888       o oo     .d8P oo     .d8P  .8'     `888.  `88.    .88'   888       o oo     .d8P      
// o8o        o888o o888ooooood8 8""88888P'  8""88888P'  o88o     o8888o  `Y8bood8P'   o888ooooood8 8""88888P' 
// Messages ///////////////////////////////////////////////////////////////////////////////////////////////////
jb.messages = {
  registry: {},
  listenersToAdd: [],
  listenersToRemove: [],

  listen: function(message, listener) {
      this.listenersToAdd.push({
          listener: listener,
          message: message
      });
  },

  unlisten: function(message, listener) {
      this.listenersToRemove.push({
          listener: listener,
          message: message
      });
  },

  reset: function() {
      this.registry = {};
      this.listenersToAdd.length = 0;
      this.listenersToRemove.length = 0;
  },

  update: function() {
      // Add pending listeners.
      for (var i = 0; i < this.listenersToAdd.length; ++i) {
          var info = this.listenersToAdd[i];
          var listeners = this.registry[info.message];
          if (!listeners) {
              listeners = [];
              this.registry[info.message] = listeners;
          }
          if (listeners.indexOf(info.listener) === -1) {
              listeners.push(info.listener);
          }
      }

      // Remove deleted listeners.
      for (var i = 0; i < this.listenersToRemove.length; ++i) {
          var info = this.listenersToRemove[i];
          var listeners = this.registry[info.message];
          if (listeners && listeners.indexOf(info.listener) >= 0) {
              jb.removeFromArray(listeners, info.listener, true);
          }
      }

      this.listenersToAdd.length = 0;
      this.listenersToRemove.length = 0;
  },

  send: function(message, target, argument) {
      var result = null;
      var listeners = this.registry[message];
      if (listeners && listeners.indexOf(target) >= 0) {
          if (target[message] && typeof(target[message]) === 'function') {
              result = target[message](argument);
          }
      }

      return result;
  },

  broadcast: function(message, argument) {
      var listeners = this.registry[message];
      if (listeners) {
          for (var i = 0; i < listeners.length; ++i) {
              if (listeners[i][message] && typeof(listeners[i][message]) === 'function') {
                  listeners[i][message](argument);
              }
          }
      }
  }
};

///////////////////////////////////////////////////////////////////////////////
// ooooooooooooo oooooo   oooo ooooooooo.   oooooooooooo  .oooooo.o 
// 8'   888   `8  `888.   .8'  `888   `Y88. `888'     `8 d8P'    `Y8 
//      888        `888. .8'    888   .d88'  888         Y88bo.      
//      888         `888.8'     888ooo88P'   888oooo8     `"Y8888o.  
//      888          `888'      888          888    "         `"Y88b 
//      888           888       888          888       o oo     .d8P 
//     o888o         o888o     o888o        o888ooooood8 8""88888P'  
// Types //////////////////////////////////////////////////////////////////////
jb.bounds = function(left, top, width, height) {
  this.set(left, top, width, height);
  this.isBound = true;
};

jb.bounds.prototype.draw = function(color, buffer) {
  var ctxt = buffer || jb.ctxt;

  ctxt.strokeStyle = color || "white";
  ctxt.beginPath();
  ctxt.moveTo(this.l, this.t);
  ctxt.lineTo(this.l + this.w, this.t);
  ctxt.lineTo(this.l + this.w, this.t + this.h);
  ctxt.lineTo(this.l, this.t + this.h);
  ctxt.closePath();
  ctxt.stroke();
};

jb.bounds.prototype.clear = function() {
  this.t = 0;
  this.l = 0;
  this.w = 0;
  this.h = 0;
};

jb.bounds.prototype.set = function(left, top, width, height) {
  this.t = top || 0;
  this.l = left || 0;
  this.w = width || 0;
  this.h = height || 0;

  this.halfWidth = Math.round(this.w * 0.5);
  this.halfHeight = Math.round(this.h * 0.5);
};

jb.bounds.prototype.contain = function(x, y) {
  return this.l <= x && this.l + this.w >= x &&
      this.t <= y && this.t + this.h >= y;
};

jb.bounds.prototype.intersectLine = function(sx, sy, ex, ey) {
  return jb.MathEx.linesIntersect(sx, sy, ex, ey, this.l, this.t, this.l + this.w, this.t) ||
      jb.MathEx.linesIntersect(sx, sy, ex, ey, this.l + this.w, this.t, this.l + this.w, this.t + this.h) ||
      jb.MathEx.linesIntersect(sx, sy, ex, ey, this.l + this.w, this.t + this.h, this.l, this.t + this.h) ||
      jb.MathEx.linesIntersect(sx, sy, ex, ey, this.l, this.t + this.h, this.l, this.t) ||
      // These last two tests shouldn't be necessary, but inaccuracies in the above four
      // tests might make them necessary.
      this.contain(sx, sy) ||
      this.contain(ex, ey);
};

jb.bounds.prototype.copyTo = function(dest) {
  dest.t = this.t;
  dest.l = this.l;
  dest.w = this.w;
  dest.h = this.h;
  dest.halfWidth = this.halfWidth;
  dest.halfHeight = this.halfHeight;
};

jb.bounds.prototype.copyFrom = function(src) {
  this.t = src.t;
  this.l = src.l;
  this.w = src.w;
  this.h = src.h;
  this.halfWidth = src.halfWidth;
  this.halfHeight = src.halfHeight;
};

jb.bounds.prototype.scale = function(sx, sy, anchorX, anchorY) {
  var xScale = sx || 1,
      yScale = sy || xScale,
      anchorPoint;

  xScale = Math.abs(xScale);
  yScale = Math.abs(yScale);
  anchorX = anchorX === undefined ? 0.5 : anchorX;
  anchorY = anchorY === undefined ? 0.5 : anchorY;

  anchorPoint = this.t + this.h * anchorY;
  this.h = Math.round(this.h * yScale);
  this.t = Math.round(anchorPoint - this.h * anchorY);

  anchorPoint = this.l + this.w * anchorX;
  this.w = Math.round(this.w * xScale);
  this.l = Math.round(anchorPoint - this.w * anchorX);

  this.halfWidth = Math.round(this.w * 0.5);
  this.halfHeight = Math.round(this.h * 0.5);
};

jb.bounds.prototype.moveTo = function(left, top) {
  this.t = top;
  this.l = left;
};

jb.bounds.prototype.moveBy = function(dl, dt) {
  this.t += dt;
  this.l += dl;
};

jb.bounds.prototype.resizeTo = function(width, height) {
  this.w = width;
  this.h = height;

  this.halfWidth = Math.round(this.w * 0.5);
  this.halfHeight = Math.round(this.h * 0.5);
};

jb.bounds.prototype.resizeBy = function(dw, dh) {
  this.w += dw;
  this.h += dh;

  this.halfWidth = Math.round(this.w * 0.5);
  this.halfHeight = Math.round(this.h * 0.5);
};

jb.bounds.prototype.overlap = function(other) {
  var bInLeftRight = false,
      bInTopBottom = false;

  jb.assert(other, "jb.bounds.intersect: invalid 'other'!");

  if (this.l < other.l) {
      bInLeftRight = other.l < this.l + this.w;
  } else {
      bInLeftRight = this.l < other.l + other.w;
  }

  if (this.t < other.t) {
      bInTopBottom = other.t < this.t + this.h;
  } else {
      bInTopBottom = this.t < other.t + other.h;
  }

  return bInLeftRight && bInTopBottom;
};

jb.bounds.prototype.intersect = function(other) {
  var bInLeftRight = false,
      bInTopBottom = false;

  jb.assert(other, "jb.bounds.intersect: invalid 'other'!");

  if (this.l < other.l) {
      bInLeftRight = other.l <= this.l + this.w;
  } else {
      bInLeftRight = this.l <= other.l + other.w;
  }

  if (this.t < other.t) {
      bInTopBottom = other.t <= this.t + this.h;
  } else {
      bInTopBottom = this.t <= other.t + other.h;
  }

  return bInLeftRight && bInTopBottom;
};

jb.bounds.prototype.intersection = function(other, result) {
  jb.assert(other && other.isBound, "jb.bounds.intersection: invalid 'other'!");
  jb.assert(result && result.isBound, "jb.bounds.intersection: invalid 'result'!");

  if (this.l < other.l) {
      result.l = other.l;
      result.w = Math.min(this.l + this.w, other.l + other.w) - result.l;
  } else {
      result.l = this.l;
      result.w = Math.min(this.l + this.w, other.l + other.w) - result.l;
  }

  if (this.t < other.t) {
      result.t = other.t;
      result.h = Math.min(this.t + this.h, other.t + other.h) - result.l;
  } else {
      result.t = this.t;
      result.h = Math.min(this.t + this.h, other.t + other.h) - result.l;
  }
};

jb.bounds.prototype.restrictX = function(xMin, xMax) {
  this.l = Math.max(this.l, xMin);
  this.l = Math.min(this.l, xMax);
};

jb.bounds.prototype.restrictY = function(yMin, yMax) {
  this.t = Math.max(this.t, yMin);
  this.t = Math.min(this.t, yMax);
};

////////////////////////////////////////////////////////////////////////////////
// oooooo     oooo ooo        ooooo 
//  `888.     .8'  `88.       .888' 
//   `888.   .8'    888b     d'888  
//    `888. .8'     8 Y88. .P  888  
//     `888.8'      8  `888'   888  
//      `888'       8    Y     888  
//       `8'       o8o        o888o 
// Virtual Machine /////////////////////////////////////////////////////////////
jb.instructions = []
jb.bStarted = false;
jb.fnIndex = 0;
jb.context = null;
jb.LOOP_ID = "DO_";
jb.bShowStopped = true;
jb.interrupt = false;
jb.time = {
  now: Date.now(),
  deltaTime: 0,
  deltaTimeMS: 0
};
jb.timers = {};

jb.stackFrame = function(pc) {
  this.pc = pc; // Program counter
  this.loopingRoutine = null;
  this.bUntil = false;
  this.bWhile = false;
};

// OS Commands /////////////////////////////////////////////////////////////////
jb.add = function(fn, label) {
  jb.instructions.push({
      type: "block",
      code: fn,
      label: label || "fn" + jb.fnIndex
  });
  jb.fnIndex += 1;
};

jb.until = function(bUntil) {
      jb.execStack[0].bUntil = bUntil;
  },

  jb.while = function(bWhile) {
      jb.execStack[0].bWhile = bWhile;
  }

// Loop code, when added, will continue to execute as long as it returns 'true'.
jb.addLoop = function(loop, label) {
  jb.instructions.push({
      type: "loop",
      code: loop,
      label: label || "fn" + jb.fnIndex
  });
  jb.fnIndex += 1;
};

jb.run = function(program) {
  var key = null;

  if (program) {
      if (!jb.bStarted) {
          jb.create();
          jb.bStarted = true;
      }

      // Move the program's functions into the jb virtual machine.
      for (key in program) {
          if (typeof(program[key]) === "function") {
              if (key.length >= jb.LOOP_ID.length && key.substr(0, jb.LOOP_ID.length).toUpperCase() === jb.LOOP_ID) {
                  jb.addLoop(program[key], key);
              } else {
                  jb.add(program[key], key);
              }
          }
      }

      jb.execStack.unshift(new jb.stackFrame(-1));

      jb.context = program;
      jb.clear();

      requestAnimationFrame(jb.loop);
  }
};

// Runtime Commands ////////////////////////////////////////////////////////////
jb.break = function() {
  jb.bInterrupt = true;
};

jb.resumeAfter = function(label) {
  var i;

  label = label.toUpperCase();

  for (i = 0; i < jb.instructions.length; ++i) {
      if (jb.instructions[i] &&
          jb.instructions[i].label.toUpperCase() === label) {
          jb.bInterrupt = true;
          jb.execStack.unshift(new jb.stackFrame(i - 1));
          break;
      }
  }
};

jb.goto = function(label) {
  var i;

  label = label.toUpperCase();

  for (i = 0; i < jb.instructions.length; ++i) {
      if (jb.instructions[i] &&
          jb.instructions[i].label.toUpperCase() === label) {
          jb.execStack[0].pc = i - 1;
          jb.execStack[0].loopingRoutine = null;
          jb.bInterrupt = true;
          break;
      }
  }
};

jb.end = function() {
  jb.execStack.shift();
  if (jb.execStack.length > 0) {
      jb.nextInstruction();
  }
};

// Internal Methods /////////////////////////////////////////////////////////////
jb.loop = function() {
  jb.updateTimers();
  jb.stateMachines.update();
  jb.messages.update();
  jb.transitions.update();
  jb.sound.update();
  jb.updateKeys();
  jb.updateTouchButtons();

  if (jb.bInterrupt) {
      jb.nextInstruction();
  } else if (jb.execStack.length > 0) {
      if (jb.execStack[0].loopingRoutine) {
          jb.execStack[0].bWhile = null;
          jb.execStack[0].bUntil = null;
          jb.execStack[0].loopingRoutine.bind(jb.context)();

          if (jb.execStack[0].bWhile === null && jb.execStack[0].bUntil === null) {
              jb.print("Missing 'jb.while' or 'jb.until' in " + jb.instructions[jb.execStack[0].pc].label);
              jb.end();
          } else if (jb.execStack[0].bUntil === true) {
              jb.nextInstruction();
          } else if (jb.execStack[0].bWhile === false) {
              jb.nextInstruction();
          }
      } else if (jb.execStack[0].pc < jb.instructions.length) {
          jb.nextInstruction();
      }
  }

  jb.render();
};

jb.render = function() {
  if (jb.execStack.length <= 0 && jb.bShowStopped) {
      jb.bShowStopped = false;
      jb.print("`");
      jb.print("--- stopped ---");
  }

  if (jb.canvas && jb.canvas.width > 0 && jb.canvas.height > 0) {

      // Refresh the screen.
      jb.screenBufferCtxt.save();

      // Clear screen.
      jb.screenBufferCtxt.fillStyle = "black";
      jb.screenBufferCtxt.fillRect(0, 0, jb.canvas.width, jb.canvas.height);

      jb.screenBufferCtxt.translate(-jb.viewOrigin.x, -jb.viewOrigin.y);
      jb.screenBufferCtxt.drawImage(jb.canvas, 0, 0);
      jb.screenBufferCtxt.restore();

      if (jb.program && jb.program.drawGUI && jb.screenBufferCtxt) {
          jb.program.drawGUI(jb.screenBufferCtxt);
      }
  }

  // Request a new a update.
  requestAnimationFrame(jb.loop);
};

jb.nextInstruction = function() {
  var instr = null;

  if (jb.execStack.length > 0) {
      for (jb.execStack[0].pc += 1; jb.execStack[0].pc < jb.instructions.length; jb.execStack[0].pc++) {
          instr = jb.instructions[jb.execStack[0].pc];

          jb.reset();
          jb.resetBlink();
          jb.bForcedBreak = false;
          jb.execStack[0].loopingRoutine = null;

          if (instr.type === "block") {
              instr.code.bind(jb.context)();
              if (jb.bInterrupt) {
                  break;
              }
          } else {
              jb.execStack[0].loopingRoutine = instr.code;
              break;
          }

          if (jb.execStack.length <= 0) {
              break;
          }
      }

      if (jb.execStack.length > 0 && jb.execStack[0].pc >= jb.instructions.length) { // !jb.execStack[0].loopingRoutine && jb.bShowStopped) {
          jb.execStack.shift();
          jb.nextInstruction();
      }
  }
};

jb.updateTimers = function() {
  var key,
      lastTime = jb.time.now;

  jb.time.now = Date.now();
  jb.time.deltaTimeMS = (jb.time.now - lastTime);
  jb.time.deltaTime = jb.time.deltaTimeMS * 0.001;

  for (key in jb.timers) {
      jb.timers[key].last = jb.timers[key].now;
      jb.timers[key].now += jb.time.deltaTime;
  }
};

jb.startTimer = function(timerName) {
  jb.timers[timerName] = jb.timers[timerName] || {
      now: 0,
      last: -1
  };

  jb.timers[timerName].now = 0;
  jb.timers[timerName].last = -1;
};

jb.setTimer = function(timerName, timerVal) {
  timerVal = timerVal === undefined ? 0 : timerVal;

  jb.timers[timerName].now = timerVal;
  jb.timers[timerName].last = timerVal;
};

jb.getTimerTicks = function(timerName, tickInterval, wantsPartialTicks) {
  var ticks = 0;

  if (jb.timers[timerName] && tickInterval > 0) {
      ticks = jb.timers[timerName].now;
      ticks /= tickInterval;

      if (!wantsPartialTicks) {
          ticks = Math.floor(ticks);
      }
  }

  return ticks;
};

jb.rewindTimerTicks = function(timerName, tickInterval, numTicks) {
  var curTime = 0,
      newTime = 0;

  if (jb.timers[timerName]) {
      curTime = jb.timers[timerName].now;
      newTime = curTime - tickInterval * numTicks;

      jb.setTimer(timerName, newTime);
  }
};

jb.timer = function(timerName) {
  return jb.timers[timerName] ? jb.timers[timerName].now : 0;
};

jb.timerLast = function(timerName) {
  return jb.timers[timerName] ? jb.timers[timerName].last : -1;
};

////////////////////////////////////////////////////////////////////////////////
// oooooo     oooo ooooo oooooooooooo oooooo   oooooo     oooo 
//  `888.     .8'  `888' `888'     `8  `888.    `888.     .8'  
//   `888.   .8'    888   888           `888.   .8888.   .8'   
//    `888. .8'     888   888oooo8       `888  .8'`888. .8'    
//     `888.8'      888   888    "        `888.8'  `888.8'     
//      `888'       888   888       o      `888'    `888'      
//       `8'       o888o o888ooooood8       `8'      `8'    
// View ////////////////////////////////////////////////////////////////////////
// Get canvas and resize to fit window.
jb.NEWLINE = "`";
jb.OPEN_TYPE_FONT_DEFAULT_VALIGN = 0.5;
jb.OPEN_TYPE_FONT_DEFAULT_HALIGN = 0.5;
jb.OPEN_TYPE_FONT_DEFAULT_COLOR = "white";
jb.canvas = null;
jb.screenBuffer = null;
jb.screenBufferCtxt = null;
jb.ctxt = null;
jb.columns = 80;
jb.viewScale = 1;
jb.doScale = false;
jb.viewOrigin = {
  x: 0,
  y: 0
};
jb.rows = 25;
jb.BLINK_INTERVAL = 0.67; // 2/3 of a second
jb.backColor = "black";
jb.foreColor = "green";
jb.fontSize = 1;
jb.row = 0;
jb.col = 0;
jb.fontInfo = null;
jb.bCursorOn = false;
jb.blinkTimer = 0;
jb.blinkClock = 0;
jb.cellSize = {
  width: 0,
  height: 0
};
jb.globalScale = 1;
jb.openTypeFont = null;
jb.openTypeFontSize = 1;
jb.openTypeFontWidthFudge = 1;
jb.fontName = "Courier";
jb.fontMetrics = new jb.bounds(0, 0, 0, 0);
jb.screen = {
  width: screen.width,
  height: screen.height
};

jb.create = function() {
  var div = document.createElement('div');

  jb.screen.width = (window.innerWidth || document.body.clientWidth);
  jb.screen.height = (window.innerHeight || document.body.clientHeight);

  div.align = "center";

  jb.canvas = document.createElement('canvas');

  jb.screenBuffer = document.createElement('canvas');
  div.appendChild(jb.screenBuffer);
  document.body.appendChild(div);

  jb.ctxt = jb.canvas.getContext("2d");
  jb.screenBufferCtxt = jb.screenBuffer.getContext("2d");

  // DEBUG:
  // jb.ctxt = jb.screenBufferCtxt;

  jb.ctxt.textBaseline = "top";
  jb.resize();
};
jb.createCanvas = function(width, height, fill) {
  var newCanvas = document.createElement('canvas'),
      newContext = newCanvas.getContext('2d');

  newCanvas.width = width || jb.canvas.width;
  newCanvas.height = height || jb.canvas.height;

  if (fill) {
      newContext.fillStyle = fill;
      newContext.fillRect(0, 0, newCanvas.width, newCanvas.height);
  } else {
      newContext.clearRect(0, 0, newCanvas.width, newCanvas.height);
  }

  return {
      canvas: newCanvas,
      context: newContext
  };
};
jb.drawImage = function(ctxt, image, xa, ya, anchorX, anchorY) {
  var x = xa - anchorX * image.width,
      y = ya - anchorY * image.height;

  if (ctxt) {
      if (jb.doScale) {
          ctxt.save();
          ctxt.scale(jb.viewScale, jb.viewScale);
      }
      ctxt.drawImage(image, x, y);
      if (jb.doScale) {
          ctxt.restore();
      }
  }
};
jb.relXtoScreenX = function(relX) {
  return Math.round(jb.canvas.width * relX);
};
jb.relYtoScreenY = function(relY) {
  return Math.round(jb.canvas.height * relY);
};
jb.screenXtoRelX = function(screenX) {
  return screenX / jb.canvas.width;
};
jb.screenYtoRelY = function(screenY) {
  return screenY / jb.canvas.height;
};
jb.drawImageNormalized = function(image, nx, ny, anchorX, anchorY) {
  var x = nx * jb.canvas.width,
      y = ny * jb.canvas.height,
      ax = anchorX || 0.5,
      ay = anchorY || 0.5;

  x = Math.round(x - ax * image.width);
  y = Math.round(y - ay * image.height);

  jb.ctxt.drawImage(image, x, y);
};
jb.drawRoundedRect = function(ctxt, x, y, w, h, r, borderColor, fillColor, borderWidth) {
  ctxt.save();

  ctxt.strokeStyle = borderColor || "black";
  ctxt.lineWidth = borderWidth || 1;

  if (fillColor) {
      ctxt.fillStyle = fillColor;
  }

  ctxt.beginPath();
  ctxt.moveTo(x + r, y);
  ctxt.lineTo(x + w - r, y);
  ctxt.quadraticCurveTo(x + w, y, x + w, y + r);
  ctxt.lineTo(x + w, y + h - r);
  ctxt.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctxt.lineTo(x + r, y + h);
  ctxt.quadraticCurveTo(x, y + h, x, y + h - r);
  ctxt.lineTo(x, y + r);
  ctxt.quadraticCurveTo(x, y, x + r, y);
  ctxt.closePath();

  if (fillColor) {
      ctxt.fill();
  }

  if (borderColor) {
      ctxt.stroke();
  }

  ctxt.restore();
};
jb.resetBlink = function() {
  jb.blinkTimer = 0;
  jb.blinkClock = Date.now();
  jb.bCursorOn = false;
};
jb.clearBlink = function() {
  var x, y;

  jb.ctxt.fillStyle = jb.backColor;
  x = jb.xFromCol(jb.col);
  y = jb.yFromRow(jb.row);
  jb.ctxt.fillRect(x, y, jb.cellSize.width + 1, jb.cellSize.height + 1);
  jb.resetBlink();
};
jb.blink = function() {
  var now = Date.now(),
      x,
      y;

  jb.blinkTimer += (now - jb.blinkClock) * 0.003;
  while (jb.blinkTimer >= jb.BLINK_INTERVAL) {
      jb.blinkTimer -= jb.BLINK_INTERVAL;
      jb.bCursorOn = !jb.bCursorOn;
  }

  jb.blinkClock = now;

  if (jb.bCursorOn) {
      jb.ctxt.fillStyle = jb.foreColor;
  } else {
      jb.ctxt.fillStyle = jb.backColor;
  }

  x = jb.xFromCol(jb.col);
  y = jb.yFromRow(jb.row);
  jb.ctxt.fillRect(x, y, jb.cellSize.width, jb.cellSize.height);
};
jb.clearLine = function(row) {
  var x, y;

  if (row >= 0 && row <= jb.rows) {
      jb.ctxt.fillStyle = jb.backColor;
      x = jb.xFromCol(0);
      y = jb.yFromRow(row);
      jb.ctxt.fillRect(x, y, jb.canvas.width, jb.cellSize.height);

      // DEBUG:
      // jb.ctxt.beginPath();
      // jb.ctxt.strokeStyle = "red";
      // jb.ctxt.rect(x, y, jb.canvas.width, jb.cellSize.height);
      // jb.ctxt.stroke();
  }
};
jb.colorRows = function() {
  var iArg = 0,
      x = 0,
      y = 0,
      color = arguments[0],
      row = 0;

  jb.ctxt.fillStyle = color;
  for (iArg = 1; iArg < arguments.length; ++iArg) {
      row = arguments[iArg];

      if (row >= 1 && row <= jb.rows) {
          row = row - 1;
          x = jb.xFromCol(0);
          y = jb.yFromRow(row);
          jb.ctxt.fillRect(x, y, jb.canvas.width, jb.cellSize.height);
      }
  }
};
jb.screenToWorldX = function(screenX) {
  return screenX / jb.viewScale + jb.viewOrigin.x;
};
jb.screenToWorldY = function(screenY) {
  return screenY / jb.viewScale + jb.viewOrigin.y;
};
jb.setViewScale = function(newScale) {
  jb.viewScale = newScale;
  jb.doScale = Math.abs(jb.viewScale - 1) > jb.EPSILON;
};
jb.getViewScale = function() {
  return jb.viewScale;
};
jb.setViewOrigin = function(x, y) {
  jb.viewOrigin.x = x || 0;
  jb.viewOrigin.y = y || 0;
};
jb.getViewSize = function() {
  var size = {
      width: jb.canvas.width,
      height: jb.canvas.height
  };
  return size;
};
jb.virtualWidth = function() {
  return Math.floor(jb.canvas.width / jb.viewScale);
};
jb.virtualHeight = function() {
  return Math.floor(jb.canvas.height / jb.viewScale);
};
jb.canvasWidth = function() {
  return Math.floor(jb.canvas.width);
};
jb.canvasHeight = function() {
  return Math.floor(jb.canvas.height);
};
jb.getViewOrigin = function() {
  return jb.viewOrigin;
};
jb.xFromCol = function(col) {
  return col * jb.cellSize.width;
};
jb.yFromRow = function(row) {
  return row * jb.cellSize.height;
};
jb.setBackColor = function(newBack) {
  jb.backColor = newBack || jb.backColor;
};
jb.setForeColor = function(newFore) {
  jb.foreColor = newFore || jb.foreColor;
};
jb.setColumns = function(newCols) {
  jb.columns = Math.max(1, newCols);
  jb.resizeFont();
};
jb.antiAlias = function(on) {
  if (jb.ctxt != null) {
      jb.ctxt.imageSmoothingEnabled = on;
  }
  if (jb.screenBufferCtxt != null) {
      jb.screenBufferCtxt.imageSmoothingEnabled = on;
  }
};
jb.getWindowSize = function() {
  var win = window,
      doc = document,
      docElem = doc.documentElement,
      body = doc.getElementsByTagName('body')[0],
      x = win.innerWidth || docElem.clientWidth || body.clientWidth,
      y = win.innerHeight || docElem.clientHeight || body.clientHeight;

  return {
      width: x,
      height: y
  };
};
jb.resize = function(width, height) {
  jb.canvas.width = width || window.innerWidth * 0.95;
  jb.canvas.height = height || window.innerHeight * 0.95;
  jb.screenBuffer.width = jb.canvas.width;
  jb.screenBuffer.height = jb.canvas.height;
  jb.resizeFont();
};
jb.resizeToWindow = function(aspectWidth, aspectHeight, pixelPerfect) {
  pixelPerfect = pixelPerfect === undefined ? true : pixelPerfect;

  var windowSize = this.getWindowSize();
  var widthScale = pixelPerfect ? Math.floor(windowSize.width / aspectWidth) : windowSize.width / aspectWidth;
  var heightScale = pixelPerfect ? Math.floor(windowSize.height / aspectHeight) : windowSize.height / aspectHeight;
  var scale = Math.min(widthScale, heightScale);

  if (scale < 1 && pixelPerfect) {
    scale = jb.resizeToWindow(aspectWidth, aspectHeight, false);
    scale = 1.0 / scale;
    var scaleLog = Math.floor(Math.log(scale) / Math.log(2) + 0.99999);
    scale = 1.0 / Math.pow(2, scaleLog);
  }

  this.resize(aspectWidth * scale, aspectHeight * scale);
  jb.setViewScale(scale);
  return scale;
};
jb.resizeFont = function() {
  var fontInfo = null

  // Estimate font size.
  var pixelsPerChar = Math.floor(jb.canvas.width / jb.columns);
  jb.fontSize = pixelsPerChar;
  jb.ctxt.textBaseline = "top";
  jb.fontInfo = "" + jb.fontSize + "px " + jb.fontName;
  jb.ctxt.font = jb.fontInfo;
  jb.openTypeFontSize = jb.fontSize;

  // Measure the text at this font size.
  var wideCharSize = jb.ctxt.measureText("W")
  jb.cellSize.width = wideCharSize.width;

  var fontScale = pixelsPerChar / jb.cellSize.width;
  jb.fontSize = Math.floor(jb.fontSize * fontScale);

  // Set the font to this scale.
  jb.fontInfo = "" + jb.fontSize + "px " + jb.fontName;
  jb.ctxt.font = jb.fontInfo;
  jb.openTypeFontSize = jb.fontSize;

  jb.cellSize.width = Math.floor(jb.cellSize.width * fontScale + 0.99999);

  var tallCharSize = jb.ctxt.measureText("Q")
  jb.cellSize.height = Math.floor(tallCharSize.actualBoundingBoxDescent - tallCharSize.actualBoundingBoxAscent + 0.99999);

  jb.rows = Math.floor(jb.canvas.height / jb.cellSize.height);
};
jb.clear = function() {
  if (jb.backColor) {
      jb.ctxt.fillStyle = jb.backColor;
      jb.ctxt.fillRect(0, 0, jb.canvas.width, jb.canvas.height);
  } else {
      jb.ctxt.clearRect(0, 0, jb.canvas.width, jb.canvas.height);
  }

  jb.home();
}
jb.home = function() {
  jb.col = 0;
  jb.row = 0;
};
jb.cursorTo = function(row, col) {
  jb.row = row >= 0 ? Math.min(row, jb.rows) : jb.row;
  jb.col = col >= 0 ? Math.min(col, jb.columns) : jb.col;
};
jb.cursorMove = function(dRow, dCol) {
  jb.row = Math.max(0, Math.min(jb.rows, jb.row + dRow));
  jb.col = Math.max(0, Math.min(jb.columns, jb.col + dCol));
};
jb.setOpenTypeFont = function(openTypeFont, size, widthFudge) {
  jb.openTypeFont = openTypeFont ? openTypeFont.openTypeFont : null;
  jb.openTypeFontSize = size || jb.fontSize;
  jb.openTypeFontWidthFudge = widthFudge || 1.0;
  jb.fontName = jb.openTypeFont.names.fontFamily;
};
jb.setWebFont = function(webFontName) {
  jb.openTypeFont = null;
  jb.fontName = webFontName;
  jb.resizeFont();
};
jb.drawOpenTypeFontAt = function(ctxt, text, x, y, strokeColor, fillColor, hAlign, vAlign) {
  var path = null,
      xFinal = 0,
      yFinal = 0;

  vAlign = vAlign || jb.OPEN_TYPE_FONT_DEFAULT_VALIGN;
  hAlign = hAlign || jb.OPEN_TYPE_FONT_DEFAULT_HALIGN;

  if (jb.openTypeFont && jb.openTypeFont && text) {
      jb.measureOpenTypeText(text);

      xFinal = x - hAlign * jb.openTypeFontMetrics.width;
      yFinal = y - (1.0 - vAlign) * jb.openTypeFontMetrics.fontBoundingBoxAscent;
      path = jb.openTypeFont.getPath(text, xFinal, yFinal);

      ctxt.save();
      path.fill = fillColor;
      path.stroke = strokeColor;
      path.draw(ctxt);
      ctxt.restore();
  }
};
jb.openTypeFontMetrics = {
  width: 0,
  actualBoundingBoxAscent: 0,
  actualBoundingBoxDescent: 0,
  fontBoundingBoxAscent: 0,
  fontBoundingBoxDescent: 0,
  text: null,
  glyphs: null,
};
jb.measureOpenTypeText = function(text) {
  var ascent = 0;
  var descent = 0;
  var width = 0;
  var scale = jb.openTypeFont ? jb.openTypeFontWidthFudge / jb.openTypeFont.unitsPerEm * jb.openTypeFontSize : 0;
  var glyphs = text === jb.openTypeFontMetrics.text ? jb.openTypeFontMetrics.glyphs : jb.openTypeFont.stringToGlyphs(text);

  if (scale > 0) {
      jb.openTypeFontMetrics.text = text;
      jb.openTypeFontMetrics.glyphs = glyphs;

      for (var i = 0; i < glyphs.length; i++) {
          var glyph = glyphs[i];
          if (glyph.advanceWidth) {
              width += glyph.advanceWidth * scale;
          }
          if (i < glyphs.length - 1) {
              kerningValue = jb.openTypeFont.getKerningValue(glyph, glyphs[i + 1]);
              width += kerningValue * scale;
          }
          ascent = Math.max(ascent, glyph.yMax);
          descent = Math.min(descent, glyph.yMin);
      }

      jb.openTypeFontMetrics.width = width;
      jb.openTypeFontMetrics.actualBoundingBoxAscent = ascent * scale;
      jb.openTypeFontMetrics.actualBoundingBoxDescent = descent * scale;
      jb.openTypeFontMetrics.fontBoundingBoxAscent = jb.openTypeFont.ascender * scale;
      jb.openTypeFontMetrics.fontBoundingBoxDescent = jb.openTypeFont.descender * scale;
  } else {
      jb.openTypeFontMetrics.width = 0;
      jb.openTypeFontMetrics.actualBoundingBoxAscent = 0;
      jb.openTypeFontMetrics.actualBoundingBoxDescent = 0;
      jb.openTypeFontMetrics.fontBoundingBoxAscent = 0;
      jb.openTypeFontMetrics.fontBoundingBoxDescent = 0;
      jb.openTypeFontMetrics.text = null;
      jb.openTypeFontMetrics.glyphs = null;
  }

  return jb.openTypeFontMetrics;
};
jb.print = function(text) {
  jb.printAt(text, 0, 0);
};
jb.printAtXY = function(text, x, y, anchorX, anchorY, fontSize, fontName) {
  anchorX = anchorX || 0;
  anchorY = anchorY || 0;
  fontSize = fontSize || jb.fontSize;
  fontName = fontName || jb.fontName;

  if (jb.openTypeFont) {
      jb.drawOpenTypeFontAt(jb.ctxt, text, x, y, jb.foreColor, jb.foreColor, anchorX, anchorY);
  } else {
      jb.ctxt.save();

      // Measure the text at this font size.
      jb.fontInfo = "" + fontSize + "px " + jb.fontName;
      jb.ctxt.font = jb.fontInfo;

      var textSize = jb.ctxt.measureText(text);
      jb.ctxt.fillStyle = jb.foreColor;
      jb.ctxt.strokeStyle = jb.foreColor;

      x = Math.round(x - anchorX * textSize.width);
      y = Math.round(y - anchorY * jb.fontSize);
      jb.ctxt.fillText(text, x, y);
      jb.ctxt.strokeText(text, x, y);

      jb.ctxt.restore();
  }
};
jb.printAt = function(text, newRow, newCol) {
  var x, y, cr, path;

  if (newRow > 0) {
      jb.row = newRow - 1;
  }
  if (newCol > 0) {
      jb.col = newCol - 1;
  }

  x = jb.xFromCol(jb.col);
  y = jb.yFromRow(jb.row);
  cr = text.indexOf(jb.NEWLINE) === text.length - 1;

  if (cr) {
      text = text.replace(jb.NEWLINE, "");
  }

  jb.ctxt.save();
  if (jb.openTypeFont) {
      path = jb.openTypeFont.getPath(text, x + jb.openTypeFontSize, y + jb.openTypeFontSize, jb.openTypeFontSize, true);
      path.fill = jb.foreColor;
      path.stroke = jb.foreColor;
      path.draw(jb.ctxt);
  } else {
      jb.ctxt.fillStyle = jb.foreColor;
      jb.ctxt.strokeStyle = jb.foreColor;
      jb.ctxt.fillText(text, x, y);
      jb.ctxt.strokeText(text, x, y);
  }
  jb.ctxt.restore();

  jb.col += text.length;
  if (cr) {
      jb.col = 0;
      jb.row += 1;
  }
};

////////////////////////////////////////////////////////////////////////////////
// ooooo ooooo      ooo ooooooooo.   ooooo     ooo ooooooooooooo 
// `888' `888b.     `8' `888   `Y88. `888'     `8' 8'   888   `8 
//  888   8 `88b.    8   888   .d88'  888       8       888      
//  888   8   `88b.  8   888ooo88P'   888       8       888      
//  888   8     `88b.8   888          888       8       888      
//  888   8       `888   888          `88.    .8'       888      
// o888o o8o        `8  o888o           `YbodP'        o888o     
// Input ///////////////////////////////////////////////////////////////////////
jb.normal = {
  last: null,
  down: {}
};
jb.special = {
  last: null,
  down: {}
};
jb.lastCode = -1;
jb.got = "";
jb.input = null;
jb.inputOut = null;
jb.minCol = 0;
jb.bWantsNewInput = true;
jb.INPUT_STATES = {
  NONE: 0,
  READ_LINE: 1,
  READ_KEY: 2
};
jb.inputState = jb.INPUT_STATES.NONE;
jb.DOUBLE_TAP_INTERVAL = 167; // Milliseconds
jb.HOLD_INTERVAL = 167; // Milliseconds
jb.GESTURE = {
  NONE: 0,
  BUSY: 1,
  TAP: 2,
  HOLD: 3,
  TAP_HOLD: 4,
  DOUBLE_TAP: 5
};
jb.pointInfo = {
  x: 0,
  y: 0,
  srcElement: null
};

jb.keys = {};
jb.keyGestures = [];
jb.touchButtonGestures = [];

jb.addNewKey = function(whichKey, downTime, upTime) {
  key = {
    waitingForPress: false,
    wasPressed: false,
    isDown: downTime !== 0,
    downTime: downTime,
    upTime: upTime,
    tapCount: 0,
    gesture: jb.GESTURE.NONE,
    code: whichKey
  };
  jb.keys[whichKey] = key;
  return key;
};

jb.isKeyDown = function(whichKey) {
  return jb.keys[whichKey] && jb.keys[whichKey].isDown;
};

jb.wasKeyPressed = function(whichKey) {
  var wasPressed = false;
  var key = jb.keys[whichKey];

  if (!key) {
    key = jb.addNewKey("return", 0, 0);
  }

  if (key && key.waitingForPress) {
      wasPressed = key.wasPressed;
      if (wasPressed) {
          key.waitingForPress = false;
          key.wasPressed = false;
      }
  } else if (key && !key.isDown) {
      key.waitingForPress = true;
  }

  return wasPressed;
};

jb.readLine = function() {
  var retVal = "";

  if (jb.inputState !== jb.INPUT_STATES.READ_LINE) {
      jb.minCol = jb.col;
  }

  jb.inputState = jb.INPUT_STATES.READ_LINE;

  retVal = jb.inputOut;
  jb.inputOut = null;
  jb.blink();

  return retVal;
};

jb.readKey = function() {
  var retVal = jb.got;

  jb.inputState = jb.INPUT_STATES.READ_KEY;

  if (retVal && retVal.length > 1) {
      if (retVal === "space") {
          retVal = " ";
      }
  } else if (!jb.got) {
      retVal = null;
  }

  jb.got = "";
  return retVal;
};

jb.reset = function() {
  jb.inputState = jb.INPUT_STATES.NONE;
  jb.inputOut = null;
  jb.got = null;
  jb.bInterrupt = false;
};

jb.clearInput = function() {
      jb.input = "";
      jb.bWantsNewInput = true;
  },

  jb.onPress = function(e) {
      var charCode = e.which || e.keyCode,
          specialCode = jb.special.last;

      e.preventDefault();
      e.stopPropagation();

      if (specialCode) {
          // User pressed a special key.
          jb.got = specialCode;

          if (specialCode === "enter" || specialCode === "return") {
              jb.inputOut = jb.input;
              jb.bWantsNewInput = true;
              jb.got = jb.NEWLINE;
              jb.inputState = jb.INPUT_STATES.NONE;
              jb.clearBlink();
          } else if (specialCode === "space") {
              if (jb.bWantsNewInput) {
                  jb.input = "";
                  jb.bWantsNewInput = false;
              }

              jb.clearBlink();
              jb.input += " ";
          } else if (specialCode === "backspace" && jb.input.length > 0) {
              jb.input = jb.input.substring(0, jb.input.length - 1);
              jb.clearBlink();
          }
      } else if (jb.codes["" + charCode] === undefined) {
          // 'Normal' key.
          jb.got = String.fromCharCode(charCode);

          if (jb.bWantsNewInput) {
              jb.input = "";
              jb.bWantsNewInput = false;
          }

          jb.clearBlink();
          jb.input += jb.got;
      }

      if (jb.inputState === jb.INPUT_STATES.READ_LINE && jb.input) {
          jb.cursorTo(jb.row, jb.minCol);
          jb.printAt(jb.input.charAt(jb.input.length - 1), jb.row + 1, jb.minCol + jb.input.length);
          jb.cursorTo(jb.row, jb.minCol + jb.input.length);
      }
  };

jb.onDown = function(e) {
  var keyCode = e.which || e.keyCode,
      specialCode = jb.codes["" + keyCode],
      lookupCode = null,
      retVal = true,
      dt = 0;

  e.preventDefault();
  e.stopPropagation();

  jb.lastCode = keyCode;

  if (specialCode) {
      lookupCode = specialCode;
  } else {
      lookupCode = String.fromCharCode(keyCode);
  }

  var key = null;
  if (jb.keys[lookupCode]) {
      if (!jb.keys[lookupCode].isDown) {
          key = jb.keys[lookupCode];
          key.isDown = true;
          key.downTime = Date.now();
          key.gesture = jb.GESTURE.NONE;

          dt = key.downTime - key.upTime;

          key.upTime = 0;
      }
  } else {
    key = jb.addNewKey(lookupCode, Date.now(), 0);
    dt = jb.DOUBLE_TAP_INTERVAL;
  }

  if (jb.keys[lookupCode].gesture === jb.GESTURE.NONE) {
      jb.keys[lookupCode].gesture = jb.GESTURE.BUSY;
      if (dt < jb.DOUBLE_TAP_INTERVAL) {
          jb.keys[lookupCode].tapCount += 1;
          if (jb.keys[lookupCode].tapCount > 2) {
              jb.keys[lookupCode].tapCount = 0;
          }
      } else {
          jb.keys[lookupCode].tapCount = 0;
      }
  }

  if (specialCode) {
      // User pressed a special key.
      jb.special.last = specialCode;
      jb.special.down[specialCode] = true;
      jb.normal.last = "";
      jb.got = specialCode;

      if (jb.inputState === jb.INPUT_STATES.READ_LINE) {
          if (specialCode === "left" ||
              specialCode === "backspace" ||
              specialCode === "del") {

              jb.clearBlink();
              jb.input = jb.input.substring(0, jb.input.length - 1);
              if (jb.col > jb.minCol) {
                  jb.cursorMove(0, -1);
              }
          }
      }

      if (specialCode === "backspace") {
          e.preventDefault();
          retVal = false;
      }
  } else {
      // 'Normal' key.
      jb.normal.last = String.fromCharCode(jb.lastCode);
      jb.got = jb.normal.last;
      jb.normal.down[jb.normal.last] = true;
      jb.special.last = "";
  }

  return retVal;
};

jb.onUp = function(e) {
  var keyCode = e.which || e.keyCode,
      specialCode = jb.codes["" + keyCode],
      lookupCode = null;

  e.preventDefault();
  e.stopPropagation();

  jb.lastCode = keyCode;

  if (specialCode) {
      lookupCode = specialCode;
  } else {
      lookupCode = String.fromCharCode(keyCode);
  }

  var key = jb.keys[lookupCode];
  if (key) {
      if (key.isDown) {
          key.isDown = false;
          key.downTime = 0;

          if (key.gesture === jb.GESTURE.HOLD || key.gesture === jb.GESTURE.TAP_HOLD) {
              key.upTime = 0;
          } else {
              key.upTime = Date.now();
          }

          if (key.waitingForPress) {
              key.wasPressed = true;
          }
      }
  } else {
    jb.addNewKey(lookupCode, 0, Date.now());
  }

  if (specialCode) {
      // User pressed a special key.
      jb.special.down[specialCode] = false;
  } else {
      // 'Normal' key.
      jb.normal.down[String.fromCharCode(jb.lastCode)] = false;
  }

  jb.onPress(e);
};

jb.updateKeys = function() {
  var i = 0,
      now = Date.now();

  jb.keyGestures.length = 0;

  for (i in jb.keys) {
      if (jb.keys[i].gesture === jb.GESTURE.BUSY) {
          if (jb.keys[i].isDown) {
              if (now - jb.keys[i].downTime > jb.HOLD_INTERVAL) {
                  if (jb.keys[i].tapCount === 0) {
                      jb.keys[i].gesture = jb.GESTURE.HOLD;
                      jb.keyGestures.push(jb.keys[i]);
                  } else {
                      jb.keys[i].gesture = jb.GESTURE.TAP_HOLD;
                      jb.keyGestures.push(jb.keys[i]);
                  }
              }
          } else {
              if (now - jb.keys[i].upTime < jb.DOUBLE_TAP_INTERVAL) {
                  if (jb.keys[i].tapCount === 0) {
                      jb.keys[i].gesture = jb.GESTURE.TAP;
                      jb.keyGestures.push(jb.keys[i]);
                  } else {
                      jb.keys[i].gesture = jb.GESTURE.DOUBLE_TAP;
                      jb.keyGestures.push(jb.keys[i]);
                  }
              } else {
                  jb.keys[i].gesture = jb.GESTURE.NONE;
              }
          }
      }
  }
};

jb.getKeyGestures = function() {
  return jb.keyGestures;
};

jb.codes = {
  3: "cancel",
  6: "help",
  8: "backspace",
  9: "tab",
  12: "clear",
  13: "return",
  14: "enter",
  16: "shift",
  17: "control",
  18: "alt",
  19: "pause",
  20: "caps lock",
  27: "escape",
  32: "space",
  33: "page up",
  34: "page down",
  35: "end",
  36: "home",
  37: "left",
  38: "up",
  39: "right",
  40: "down",
  44: "printscreen",
  45: "insert",
  46: "delete",
};

jb.KEYCODE = {
  CANCEL: 3,
  HELP: 6,
  BACKSPACE: 8,
  TAB: 9,
  CLEAR: 12,
  RETURN: 13,
  ENTER: 14,
  SHIFT: 16,
  CONTROL: 17,
  ALT: 18,
  PAUSE: 19,
  CAPSLOCK: 20,
  ESCAPE: 27,
  SPACE: 32,
  PAGEUP: 33,
  PAGEDOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  PRINTSCREEN: 44,
  INSERT: 45,
  DELETE: 46,
};

jb.getMouseX = function(e) {
  return Math.round((e.srcElement ? e.pageX - e.srcElement.offsetLeft : (e.target ? e.pageX - e.target.offsetLeft : e.pageX)) / jb.globalScale);
};

jb.getMouseY = function(e) {
  return Math.round((e.srcElement ? e.pageY - e.srcElement.offsetTop : (e.target ? e.pageY - e.target.offsetTop : e.pageY)) / jb.globalScale);
};

jb.getClientPos = function(touch) {
  // Adapted from gregers' response in StackOverflow:
  // http://stackoverflow.com/questions/5885808/includes-touch-events-clientx-y-scrolling-or-not

  var winOffsetX = window.pageXoffset;
  var winOffsetY = window.pageYoffset;
  var x = touch.clientX;
  var y = touch.clientY;

  if (touch.pageY === 0 && Math.floor(y) > Math.floor(touch.pageY) ||
      touch.pageX === 0 && Math.floor(x) > Math.floor(touch.pageX)) {
      x = x - winOffsetX;
      y = y - winOffsetY;
  } else if (y < (touch.pageY - winOffsetY) || x < (touch.pageX - winOffsetX)) {
      x = touch.pageX - winOffsetX;
      y = touch.pageY - winOffsetY;
  }

  jb.pointInfo.x = x;
  jb.pointInfo.y = y;
  jb.pointInfo.srcElement = jb.canvas ? jb.canvas : null;

  return jb.pointInfo;
};

jb.tap = {
  bListening: false,
  x: -1,
  y: -1,
  done: false,
  count: 0,
  isDoubleTap: false,
  lastTapTime: 0,
  touched: null
};
jb.swipe = {
  bListening: false,
  startX: -1,
  startY: -1,
  lastX: -1,
  lastY: -1,
  endX: -1,
  endY: -1,
  startTime: 0,
  endTime: 0,
  swiped: [],
  allSwiped: [],
  done: false
};
jb.swipe.isWiderThan = function(dx) {
  return Math.abs(jb.swipe.lastX - jb.swipe.startX) >= dx;
};
jb.swipe.isTallerThan = function(dy) {
  return Math.abs(jb.swipe.lastY - jb.swipe.startY) >= dy;
};
jb.swipe.isBiggerThan = function(dx, dy) {
  return jb.swipe.isTallerThan(dx) && jb.swipe.isWiderThan(dy);
};
jb.swipe.top = function() {
  return Math.min(jb.swipe.startY, jb.swipe.lastY);
};
jb.swipe.left = function() {
  return Math.min(jb.swipe.startX, jb.swipe.lastX);
};
jb.swipe.width = function() {
  return Math.abs(jb.swipe.lastX - jb.swipe.startX);
};
jb.swipe.height = function() {
  return Math.abs(jb.swipe.lastY - jb.swipe.startY);
};
jb.screenWidth = function() {
  return jb.canvas.width;
};
jb.screenHeight = function() {
  return jb.canvas.height;
};
jb.swipe.isUp = function() {
  return jb.swipe.lastY < jb.swipe.startY;
};
jb.swipe.isLeft = function() {
  return jb.swipe.lastX < jb.swipe.startX;
};
jb.listenForTap = function() {
  jb.resetTap();
  jb.tap.bListening = true;
  jb.tap.touched = false;
};
jb.isTapped = function() {
  if (!jb.tap.bListening) {
    jb.listenForTap();
  }

  return jb.tap.done;
};

jb.resetTap = function() {
  jb.tap.x = -1;
  jb.tap.y = -1;
  jb.tap.done = false;
  jb.tap.isDoubleTap = false;
  jb.tap.lastTapTime = -1;
  jb.tap.bListening = false;
};

jb.listenForSwipe = function() {
  jb.resetSwipe();
  jb.swipe.bListening = true;
};

jb.resetSwipe = function() {
  jb.swipe.startX = -1;
  jb.swipe.startY = -1;
  jb.swipe.lastX = -1;
  jb.swipe.lastY = -1;
  jb.swipe.endX = -1;
  jb.swipe.endY = -1;
  jb.swipe.startTime = 0;
  jb.swipe.endTime = 0;
  jb.swipe.done = false;
  jb.swipe.started = false;
  jb.swipe.bListening = false;
};

jb.doubleTapTimedOut = function() {
  return Date.now() - jb.tap.lastTapTime >= jb.DOUBLE_TAP_INTERVAL;
};

jb.mouseDown = function(e) {
  jb.pointInfo.x = jb.getMouseX(e);
  jb.pointInfo.y = jb.getMouseY(e);
  window.addEventListener("mousemove", jb.mouseDrag, true);
  jb.gestureStart();
  jb.onTouchDown("mouse", jb.pointInfo.x, jb.pointInfo.y);
};

jb.mouseDrag = function(e) {
  jb.pointInfo.x = jb.getMouseX(e);
  jb.pointInfo.y = jb.getMouseY(e);
  jb.gestureContinue();
};

jb.mouseUp = function(e) {
  window.removeEventListener("mousemove", jb.mouseDrag, true);
  jb.pointInfo.x = jb.getMouseX(e);
  jb.pointInfo.y = jb.getMouseY(e);
  jb.gestureEnd();
  jb.onTouchUp("mouse");
};

jb.gestureStart = function() {
  var newNow = Date.now(),
      x = jb.pointInfo.x
      y = jb.pointInfo.y;


  if (jb.tap.bListening) {
      jb.tap.x = x;
      jb.tap.y = y;
      jb.tap.count = newNow - jb.tap.lastTapTime >= jb.DOUBLE_TAP_INTERVAL ? 1 : jb.tap.count + 1;
      jb.tap.isDoubleTap = jb.tap.count > 1 && newNow - jb.tap.lastTapTime < jb.DOUBLE_TAP_INTERVAL;
      jb.tap.lastTapTime = newNow;
      jb.tap.touched = jb.touchables.getTouched(x, y);
      jb.tap.done = true;

      if (jb.tap.isDoubleTap || jb.tap.count > 1) {
          jb.tap.count = 0;
      }
  }

  if (jb.swipe.bListening) {
      jb.swipe.startX = x;
      jb.swipe.startY = y;
      jb.swipe.lastX = x;
      jb.swipe.lastY = y;
      jb.swipe.endX = x;
      jb.swipe.endY = y;
      jb.swipe.startTime = newNow;
      jb.swipe.swiped.length = 0;
      jb.swipe.allSwiped.length = 0;
      jb.swipe.started = true;
      jb.swipe.done = false;
  }
};

jb.gestureContinue = function() {
  if (jb.swipe.startTime) {
      jb.swipe.lastX = jb.swipe.endX;
      jb.swipe.lastY = jb.swipe.endY;
      jb.swipe.endX = jb.pointInfo.x;
      jb.swipe.endY = jb.pointInfo.y;

      jb.swipeables.getSwiped(jb.swipe.lastX, jb.swipe.lastY, jb.swipe.endX, jb.swipe.endY);
  }
};

jb.gestureEnd = function() {
  var i = 0;

  if (jb.tap.touched && jb.tap.touched.onUntouched) {
      jb.tap.touched.onUntouched(jb.swipe.endX, jb.swipe.endY);
  }

  if (jb.swipe.startTime) {
      jb.swipe.lastX = jb.swipe.endX;
      jb.swipe.lastY = jb.swipe.endY;
      jb.swipe.endX = jb.pointInfo.x
      jb.swipe.endY = jb.pointInfo.y;
      jb.swipe.endTime = Date.now();
      jb.swipe.done = true;

      jb.swipeables.getSwiped(jb.swipe.lastX, jb.swipe.lastY, jb.swipe.endX, jb.swipe.endY);

      if (jb.swipe.swiped) {
          for (i = 0; i < jb.swipe.swiped.length; ++i) {
              if (jb.swipe.swiped[i] !== jb.tap.touched && jb.swipe.swiped[i].onUntouched) {
                  jb.swipe.swiped[i].onUntouched(jb.swipe.endX, jb.swipe.endY);
              }
          }
      }
  }
};

jb.touchStart = function(e) {
      if (e) {
          e.preventDefault();
          e.stopPropagation();

          for (var i = 0; i < e.touches.length; ++i) {
              jb.getClientPos(e.touches[i]);
              jb.onTouchDown(e.touches[i].identifier, jb.pointInfo.x, jb.pointInfo.y);
          }

          if (e.touches.length === 1) {
              jb.getClientPos(e.touches[0]);
              jb.gestureStart();
          }
      }
  },

  jb.touchMove = function(e) {
      if (e) {
          e.preventDefault();
          e.stopPropagation();

          if (e.touches.length === 1) {
              jb.getClientPos(e.touches[0]);
              jb.gestureContinue();
          }
      }
  },

  jb.touchEnd = function(e) {
      if (e) {
          e.preventDefault();
          e.stopPropagation();

          for (var i = 0; i < e.touches.length; ++i) {
              jb.onTouchUp(e.touches[i].identifier);
          }
      }

      jb.gestureEnd();
  },

  jb.onTouchDown = function(id, x, y) {
      var dt = 0,
          now = Date.now();

      for (var i = 0; i < jb.touchButtons.length; ++i) {
          var btn = jb.touchButtons[i];
          if (!btn.isDown && btn.bounds.contain(x, y)) {
              btn.touchId = id;
              btn.isDown = true;
              btn.dt = now - btn.upTime;
              btn.downTime = now;
              btn.upTime = 0;
              btn.gesture = jb.GESTURE.BUSY;

              if (btn.dt < jb.DOUBLE_TAP_INTERVAL) {
                  btn.tapCount += 1;
                  btn.tapCount = btn.tapCount % 3;
              } else {
                  btn.tapCount = 0;
              }
          }
      }
  };

jb.onTouchUp = function(touchId) {
  var now = Date.now();

  for (var i = 0; i < jb.touchButtons.length; ++i) {
      var btn = jb.touchButtons[i];
      if (btn.touchId === touchId) {
          btn.isDown = false;
          btn.downTime = 0;
          btn.upTime = now;
      }
  }
};

jb.getTouchButtonGestures = function() {
  return jb.touchButtonGestures;
};

jb.updateTouchButtons = function() {
  var i = 0,
      now = Date.now();

  jb.touchButtonGestures.length = 0;

  for (i = 0; i < jb.touchButtons.length; ++i) {
      var btn = jb.touchButtons[i];

      if (btn.gesture === jb.GESTURE.BUSY) {
          if (btn.isDown) {
              if (now - btn.downTime > jb.HOLD_INTERVAL) {
                  if (btn.tapCount === 0) {
                      btn.gesture = jb.GESTURE.HOLD;
                      jb.touchButtonGestures.push(btn);
                  } else {
                      btn.gesture = jb.GESTURE.TAP_HOLD;
                      jb.touchButtonGestures.push(btn);
                  }
              }
          } else {
              if (now - btn.upTime > jb.DOUBLE_TAP_INTERVAL) {
                  if (btn.tapCount === 0) {
                      btn.gesture = jb.GESTURE.TAP;
                      jb.touchButtonGestures.push(btn);
                  } else {
                      btn.gesture = jb.GESTURE.DOUBLE_TAP;
                      jb.touchButtonGestures.push(btn);
                  }
              }
          }

          if (btn.gesture !== jb.GESTURE.BUSY) {
              btn.tapCount = 0;
          }
      }
  }
};

jb.touchButtons = [];
jb.addTouchButton = function(id, left, top, width, height) {
      jb.touchButtons.push({
          id: id,
          dt: 0,
          bounds: new jb.bounds(left, top, width, height),
          isDown: false,
          downTime: 0,
          upTime: 0,
          tapCount: 0,
          gesture: jb.GESTURE.NONE,
          touchId: -1
      })
  },

  document.addEventListener("keydown", jb.onDown, true);
document.addEventListener("keyup", jb.onUp, true);

window.addEventListener("mousedown", jb.mouseDown, true);
window.addEventListener("mouseup", jb.mouseUp, true);

window.addEventListener("touchstart", jb.touchStart, true);
window.addEventListener("touchmove", jb.touchMove, true);
window.addEventListener("touchend", jb.touchEnd, true);

////////////////////////////////////////////////////////////////////////////////
// oooooooooooo   .oooooo.   ooooo      ooo ooooooooooooo  .oooooo.o 
// `888'     `8  d8P'  `Y8b  `888b.     `8' 8'   888   `8 d8P'    `Y8 
//  888         888      888  8 `88b.    8       888      Y88bo.      
//  888oooo8    888      888  8   `88b.  8       888       `"Y8888o.  
//  888    "    888      888  8     `88b.8       888           `"Y88b 
//  888         `88b    d88'  8       `888       888      oo     .d8P 
// o888o         `Y8bood8P'  o8o        `8      o888o     8""88888P'  
// FONTS ///////////////////////////////////////////////////////////////////////
// Fonts are bitmapped character sets. They default to 16x16 size and can be
// scaled in integer amounts.
jb.fonts = {
  DEFAULT_SIZE: 16,

  drawToContextAt: function(ctxt, fontName, x, y, text, color, hAlign, vAlign, scale) {
      var charSet = null,
          iChar = 0,
          curChar = null,
          fontChar = null,
          cr = null,
          image = null;

      charSet = jb.fonts[fontName];
      hAlign = hAlign || 0;
      vAlign = vAlign || 0;
      color = color || jb.foreColor;
      scale = scale || 1;
      scale = Math.round(scale);

      if (text && charSet) {
          if (charSet.bCaseless) {
              text = text.toUpperCase();
          }

          // Compensate for desired alignment.
          y += scale * this.DEFAULT_SIZE * (0.5 + (vAlign - 0.5));
          x -= scale * this.DEFAULT_SIZE * text.length * (0.5 + (hAlign - 0.5));

          ctxt.save();
          ctxt.fillStyle = color;
          ctxt.lineWidth = scale;
          ctxt.strokeStyle = color;

          for (iChar = 0; iChar < text.length; ++iChar) {
              curChar = text.charAt(iChar);

              if (curChar !== ' ') {
                  fontChar = charSet[curChar];

                  if (fontChar) {
                      image = this.imageForChar(fontChar, color, scale);
                      ctxt.drawImage(image, x, y);
                  } else {
                      ctxt.rect(x, y, scale * this.DEFAULT_SIZE, scale * this.DEFAULT_SIZE);
                  }
              }

              x += scale * this.DEFAULT_SIZE;
          }

          ctxt.restore()
      }
  },

  drawAt: function(fontName, x, y, text, color, hAlign, vAlign, scale) {
      this.drawToContextAt(jb.ctxt, fontName, x, y, text, color, hAlign, vAlign, scale);
  },

  print: function(fontName, text, color, hAlign, vAlign, scale) {
      jb.fonts.printAt(fontName, jb.row + 1, jb.col + 1, text, color, hAlign, vAlign, scale);
  },

  printAt: function(fontName, newRow, newCol, text, color, hAlign, vAlign, scale) {
      var x = 0,
          y = 0,
          row = jb.row,
          col = jb.col,
          charSet = null,

          charSet = jb.fonts[fontName];

      if (text && charSet) {
          cr = text.indexOf(jb.NEWLINE) === text.length - 1;

          if (newRow > 0) {
              row = newRow - 1;
          } else {
              newRow = jb.row;
          }

          if (newCol > 0) {
              col = newCol - 1;
          } else {
              newCol = jb.col;
          }

          // Assume top-left alignment.
          x = jb.xFromCol(col);
          y = jb.yFromRow(row);

          jb.fonts.drawAt(fontName, x, y, text, color, hAlign, vAlign, scale);

          col += text.length * scale;
          if (cr) {
              col = 0;
              row += scale;
          }

          jb.row = row;
          jb.col = col;
      }
  },

  imageForChar: function(fontChar, color, scale) {
      var key = color + scale,
          image = null,
          iRow = 0,
          iCol = 0,
          x = 0,
          y = 0,
          canvas = null,
          ctxt = null;

      if (fontChar) {
          image = fontChar.images[key];

          if (!image) {
              // This image doesn't yet exist, so we need to create it.
              canvas = document.createElement('canvas');
              canvas.width = fontChar.data[0].length * scale;
              canvas.height = fontChar.data.length * scale;
              ctxt = canvas.getContext('2d');

              ctxt.fillStyle = color;
              for (iRow = 0; iRow < fontChar.data.length; ++iRow) {
                  y = scale * iRow;
                  for (iCol = 0; iCol < fontChar.data[0].length; ++iCol) {
                      x = scale * iCol;
                      if (fontChar.data[iRow].charAt(iCol) !== '.') {
                          ctxt.fillRect(x, y, scale, scale);
                      }
                  }
              }

              image = canvas;
              fontChar.images[key] = image;
          }
      }

      return image;
  },

  fantasy: {
      bCaseless: true,
      Empty: {
          data: ["................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
          ],
          images: {}
      },
      A: {
          data: ["................",
              "........000.....",
              ".......000000...",
              "......000.000...",
              "......000..000..",
              "......000..000..",
              ".....000...000..",
              ".....000...000..",
              ".0000000000000..",
              ".0000000000000..",
              ".00.000....000..",
              ".0..000....000..",
              "...000.....000..",
              "...000.....000..",
              "..000......000..",
              "..000......000..",
          ],
          images: {}
      },
      B: {
          data: ["................",
              "..0000000000....",
              "..00000000000...",
              "..00.000000000..",
              "..0..000...000..",
              "....0000...000..",
              "....0000.0000...",
              "....000000000...",
              "...00000000000..",
              "...0000...0000..",
              "...000.....0000.",
              "..0000......000.",
              "..0000......000.",
              "..000.....00000.",
              ".0000000000000..",
              ".000000000000...",
          ],
          images: {}
      },
      C: {
          data: ["................",
              ".......00000....",
              ".....0000000.00.",
              "....000....0000.",
              "...000......00..",
              "..000.......0...",
              "..000...........",
              ".000............",
              ".000............",
              ".000............",
              ".000............",
              ".000.......0....",
              ".000......00....",
              "..000....000....",
              "...000000000....",
              "....000000......",
          ],
          images: {}
      },
      D: {
          data: ["................",
              "..00000000000...",
              "..000000000000..",
              "..00.000...0000.",
              "..0.000.....000.",
              "...000......000.",
              "...000......000.",
              "..0000......000.",
              "..000.......000.",
              "..000.......000.",
              "..000......000..",
              "..000......000..",
              "..000.....000...",
              ".000.....000....",
              ".0000000000.....",
              ".000000000......",
          ],
          images: {}
      },
      E: {
          data: ["................",
              ".......0000000..",
              ".....000000000..",
              "....0000....00..",
              "....000......0..",
              "...000..........",
              "...000..........",
              "...00000000.....",
              "..00000000......",
              "..000...........",
              ".000............",
              ".000............",
              ".000........0...",
              ".0000......00...",
              ".000000000000...",
              "..000000000.....",
          ],
          images: {}
      },
      F: {
          data: ["................",
              "..0000000000000.",
              "..0000000000000.",
              "..00.000....00..",
              "..0.000......0..",
              "...000..........",
              "...000..........",
              "...00000000.....",
              "..00000000......",
              "..000...........",
              "..000...........",
              "..000...........",
              ".000............",
              ".000............",
              ".000............",
              ".000............",
          ],
          images: {}
      },
      G: {
          data: ["................",
              ".......00000....",
              ".....0000000.00.",
              "....000....0000.",
              "...000......00..",
              "..000.......0...",
              ".0000...........",
              ".000............",
              ".000............",
              ".000....00000...",
              ".000....00000...",
              ".000....0..00...",
              ".000......000...",
              "..000....000....",
              "...000000000....",
              "....000000......",
          ],
          images: {}
      },
      H: {
          data: ["................",
              "......000....000",
              ".....000....000.",
              ".....000....000.",
              ".....000....000.",
              "....000....000..",
              "....000....000..",
              "....000....000..",
              "....00000000000.",
              "...00000000000..",
              "...000....000...",
              "...000....000...",
              "...000....000...",
              "..000....000....",
              "..000....000....",
              "..000....000....",
          ],
          images: {}
      },
      I: {
          data: ["................",
              "......000000....",
              "......000000....",
              "......00.000....",
              "......0.000.....",
              "........000.....",
              "........000.....",
              ".......000......",
              ".......000......",
              ".......000......",
              "......000.......",
              "......000.......",
              "......000.0.....",
              ".....000.00.....",
              ".....000000.....",
              ".....000000.....",
          ],
          images: {}
      },
      J: {
          data: ["................",
              ".......00000000.",
              ".......00000000.",
              ".......00...000.",
              ".......0....000.",
              "............000.",
              "...........000..",
              "...........000..",
              "...........000..",
              "..........000...",
              "..000.....000...",
              "..000.....000...",
              ".000.....000....",
              ".000.....000....",
              ".0000000000.....",
              "...0000000......",
          ],
          images: {}
      },
      K: {
          data: ["................",
              "......000...000.",
              ".....000....000.",
              ".....000...000..",
              ".....000..000...",
              "....000..000....",
              "....000..000....",
              "....000.000.....",
              "....0000000.....",
              "....000.000.....",
              "...000..000.....",
              "...000...000....",
              "...000....000...",
              "..000.....000...",
              "..000......000..",
              "..000......000..",
          ],
          images: {}
      },
      L: {
          data: ["................",
              "...000000.......",
              "...000000.......",
              "...00.000.......",
              "...0.000........",
              ".....000........",
              ".....000........",
              "....000.........",
              "....000.........",
              "....000.........",
              "...000..........",
              "...000..........",
              "...000......0...",
              "..000......00...",
              "..00000000000...",
              "..00000000000...",
          ],
          images: {}
      },
      M: {
          data: ["...............",
              "...000.....000.",
              "...000.....000.",
              "...0000...0000.",
              "...0000..00000.",
              "...0000..00000.",
              "..00000.00000..",
              "..000.000.000..",
              "..000.000.000..",
              "..000.000.000..",
              "..000..0..000..",
              ".000.....000...",
              ".000.....000...",
              ".000.....000...",
              ".000.....000...",
              ".000.....000...",
          ],
          images: {}
      },
      N: {
          data: ["...............",
              "...000.....000.",
              "...000.....000.",
              "...000.....000.",
              "...0000....000.",
              "...0000....000.",
              "..000000..000..",
              "..000.000.000..",
              "..000.000.000..",
              "..000.000.000..",
              "..000..000000..",
              ".000....0000...",
              ".000....0000...",
              ".000.....000...",
              ".000.....000...",
              ".000.....000...",
          ],
          images: {}
      },
      O: {
          data: ["................",
              ".......000000...",
              ".....000000000..",
              ".....000....000.",
              "....000.....000.",
              "...000......000.",
              "..000.......000.",
              "..000.......000.",
              "..000.......000.",
              ".000.......000..",
              ".000.......000..",
              ".000.......000..",
              ".000......000...",
              "..000....000....",
              "...000000000....",
              "....000000......",
          ],
          images: {}
      },
      P: {
          data: ["................",
              "..00000000000...",
              "..000000000000..",
              "..00.000...000..",
              "..0.000.....000.",
              "...000......000.",
              "...000......000.",
              "...0000....000..",
              "...0000000000...",
              "...0000000......",
              "..000...........",
              "..000...........",
              "..000...........",
              ".000............",
              ".000............",
              ".000............",
          ],
          images: {}
      },
      Q: {
          data: ["................",
              ".......000000...",
              ".....000000000..",
              ".....000....000.",
              "....000.....000.",
              "...000......000.",
              "..000.......000.",
              "..000.......000.",
              "..000.......000.",
              ".000.......000..",
              ".000.......000..",
              ".000...00..000..",
              "..000...00000...",
              "...000000000....",
              "....0000000000..",
              "...........000..",
          ],
          images: {}
      },
      R: {
          data: ["................",
              "..00000000000...",
              "..000000000000..",
              "..00.000...000..",
              "..0.000.....000.",
              "...000......000.",
              "...000......000.",
              "...0000....000..",
              "..00000000000...",
              "..000000000.....",
              "..000...000.....",
              "..000....000....",
              "..000.....000...",
              ".000......000...",
              ".000.......000..",
              ".000.......000..",
          ],
          images: {}
      },
      S: {
          data: ["................",
              ".......00000....",
              ".....0000000.00.",
              ".....000...0000.",
              "....000.....00..",
              "...000......0...",
              "...000..........",
              "...000000.......",
              ".....000000.....",
              ".......000000...",
              "..........000...",
              "...0.......000..",
              "..00.......000..",
              ".0000.....000...",
              ".00.00000000....",
              ".....00000......",
          ],
          images: {}
      },
      T: {
          data: ["................",
              "..0000000000000.",
              "..0000000000000.",
              "..00...000..00..",
              "..0....000...0..",
              ".......000......",
              "......000.......",
              "......000.......",
              "......000.......",
              ".....000........",
              ".....000........",
              ".....000........",
              "....000.........",
              "....000.........",
              "....000.........",
              ".....000........",
          ],
          images: {}
      },
      U: {
          data: ["................",
              ".000000.....000.",
              ".000000.....000.",
              ".00000.....000..",
              ".0.000.....000..",
              "...000.....000..",
              "...000.....000..",
              "...000.....000..",
              "..000.....000...",
              "..000.....000...",
              "..000.....000...",
              "..000.....000...",
              "..000.....000...",
              "..0000...000....",
              "...00000000.....",
              "....000000......",
          ],
          images: {}
      },
      V: {
          data: ["................",
              "..000.......000.",
              "..000.......000.",
              "..000.......000.",
              "..000......000..",
              "..000......000..",
              "...000.....000..",
              "...000....000...",
              "...000....000...",
              "...000....000...",
              "...000...000....",
              "....000..000....",
              "....000..000....",
              "....000.000.....",
              "....0000000.....",
              ".....00000......",
          ],
          images: {}
      },
      W: {
          data: ["...............",
              "...000.....000.",
              "...000.....000.",
              "...000.....000.",
              "...000.....000.",
              "...000.....000.",
              "..000..0..000..",
              "..000.000.000..",
              "..000.000.000..",
              "..000.000.000..",
              "..00000.00000..",
              ".00000..0000...",
              ".00000..0000...",
              ".0000...0000...",
              ".000.....000...",
              ".000.....000...",
          ],
          images: {}
      },
      X: {
          data: ["...............",
              "...000.....000.",
              "...000.....000.",
              "...000.....000.",
              "..000.....000..",
              "..000.....000..",
              "..0000...0000..",
              "...000000000...",
              "......000......",
              "......000......",
              "...000000000...",
              "..000.....000..",
              "..000.....000..",
              ".000......000..",
              ".000.....000...",
              ".000.....000...",
          ],
          images: {}
      },
      Y: {
          data: ["...............",
              "...000.....000.",
              "...000.....000.",
              "...000.....000.",
              "..000.....000..",
              "..000.....000..",
              "..0000...0000..",
              "...000000000...",
              "......000......",
              "......000......",
              "......000......",
              "......000......",
              ".....000.......",
              ".....000.......",
              ".....000.......",
              ".....000.......",
          ],
          images: {}
      },
      Z: {
          data: ["................",
              "..000000000000..",
              "..000000000000..",
              "..00.......000..",
              "..0.......000...",
              ".........000....",
              "........000.....",
              ".......000......",
              "......000.......",
              ".....000........",
              "....000.........",
              "...000..........",
              "..000......0....",
              ".000......00....",
              ".00000000000....",
              ".00000000000....",
          ],
          images: {}
      },
      0: {
          data: ["................",
              "......0000000...",
              "....0000000000..",
              "...0000....0000.",
              "...000......000.",
              "..000.......000.",
              "..000.......000.",
              "..000.......000.",
              ".000.......000..",
              ".000.......000..",
              ".000.......000..",
              ".000......000...",
              ".000......000...",
              "..0000...0000...",
              "...00000000.....",
              ".....0000.......",
          ],
          images: {}
      },
      1: {
          data: ["................",
              "..........0000..",
              "........000000..",
              ".......0000000..",
              "......000.000...",
              "..........000...",
              "..........000...",
              ".........000....",
              ".........000....",
              ".........000....",
              "........000.....",
              "........000.....",
              "........000.....",
              ".......000......",
              ".......000......",
              ".......000......",
          ],
          images: {}
      },
      2: {
          data: ["................",
              "......000000....",
              "....0000000000..",
              "...0000.....000.",
              "..000.......000.",
              "...........000..",
              "...........000..",
              "..........000...",
              ".........000....",
              "........000.....",
              "......000.......",
              ".....000........",
              "...000........0.",
              "..000........00.",
              "..0000000000000.",
              "..0000000000000.",
          ],
          images: {}
      },
      3: {
          data: ["................",
              "......000000....",
              "....0000000000..",
              "...0000.....000.",
              "..000.......000.",
              "...........000..",
              "...........000..",
              "........00000...",
              "......000000....",
              ".........0000...",
              "..........0000..",
              "............000.",
              "...000......000.",
              "..000.......000.",
              "..000000000000..",
              "....00000000....",
          ],
          images: {}
      },
      4: {
          data: ["................",
              "..........0000..",
              ".........00000..",
              "........000.00..",
              ".......000..00..",
              "......000..00...",
              ".....000...00...",
              "....000...000...",
              "...000....000...",
              "..0000000000000.",
              ".0000000000000..",
              "........000.....",
              "........000.....",
              ".......000......",
              ".......000......",
              ".......000......",
          ],
          images: {}
      },
      5: {
          data: ["................",
              "...000000000000.",
              "...000000000000.",
              "...000.....000..",
              "...000......00..",
              "..000.......0...",
              "..0000..........",
              "..00000000......",
              "..0000000000....",
              "........00000...",
              "..........0000..",
              "...0.......000..",
              "..00.......000..",
              ".0000.....000...",
              ".00.00000000....",
              ".....00000......",
          ],
          images: {}
      },
      6: {
          data: ["................",
              "......0000000...",
              "....0000000000..",
              "...0000....0000.",
              "...000.......00.",
              "..000........0..",
              "..000...........",
              "..000..00000....",
              ".0000000000000..",
              ".0000......0000.",
              ".000........000.",
              ".000........000.",
              ".000........000.",
              "..0000.....000..",
              "...0000000000...",
              ".....000000.....",
          ],
          images: {}
      },
      7: {
          data: ["................",
              "..0000000000000.",
              "..0000000000000.",
              "..00........000.",
              "..0........000..",
              "..........000...",
              ".........000....",
              "........000.....",
              ".......000......",
              "......000.......",
              ".....000........",
              "....000.........",
              "...000..........",
              "..000...........",
              "..000...........",
              "..000...........",
          ],
          images: {}
      },
      8: {
          data: ["................",
              "......0000000...",
              "....0000000000..",
              "...0000....0000.",
              "...000......000.",
              "..000.......000.",
              "..000.......000.",
              "...0000000000...",
              "...00000000000..",
              "..0000.....0000.",
              ".000........000.",
              ".000........000.",
              ".000........000.",
              "..0000.....000..",
              "...0000000000...",
              ".....000000.....",
          ],
          images: {}
      },
      9: {
          data: ["................",
              ".....000000.....",
              "...0000000000...",
              "..000.....0000..",
              ".000........000.",
              ".000........000.",
              ".000........000.",
              ".0000......0000.",
              "..0000000000000.",
              "....00000..000..",
              "...........000..",
              "..0........000..",
              ".00.......000...",
              ".0000....0000...",
              "..0000000000....",
              "...0000000......",
          ],
          images: {}
      },
      '!': {
          data: ["................",
              "......0000000...",
              "......0000000...",
              "......0000000...",
              ".....000000.....",
              ".....000000.....",
              ".....000000.....",
              ".....000000.....",
              "....00000.......",
              "....00000.......",
              "....0000........",
              "....000.........",
              "................",
              "...00000........",
              "...00000........",
              "..00000.........",
          ],
          images: {}
      },
      '?': {
          data: ["................",
              "......000000...",
              "....0000000000..",
              "...0000.....000.",
              "..000.......000.",
              "...........000..",
              "...........000..",
              "........00000...",
              "......00000.....",
              "....0000........",
              "...0000.........",
              "...000..........",
              "................",
              "...0000.........",
              "...0000.........",
              "..0000..........",
          ],
          images: {}
      },
      '.': {
          data: ["................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "...0000.........",
              "...0000.........",
              "...0000.........",
          ],
          images: {}
      },
      ',': {
          data: ["................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "....00..........",
              "...0000.........",
              "...0000.........",
              "..000...........",
          ],
          images: {}
      },
      "'": {
          data: ["................",
              ".......00.......",
              "......0000......",
              "......0000......",
              ".....000........",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
          ],
          images: {}
      },
  },

  scifi: {
      bCaseless: true,
      Empty: {
          data: ["................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
          ],
          images: {}
      },
      A: {
          data: ["................",
              "...0000000000...",
              ".00000000000000.",
              ".0000......0000.",
              ".0000......0000.",
              "...........0000.",
              ".0000......0000.",
              ".00000000000000.",
              ".00000000000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      B: {
          data: ["................",
              ".000000000000...",
              ".00000000000000.",
              ".0000......0000.",
              ".0000......0000.",
              "...........0000.",
              ".000000000000...",
              ".000000000000...",
              ".00000000000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".00000000000000.",
              ".000000000000...",
              "................",
              "................",
          ],
          images: {}
      },
      C: {
          data: ["................",
              "...0000000000...",
              ".00000000000000.",
              ".0000......0000.",
              ".0000......0000.",
              "................",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000......0000.",
              ".0000......0000.",
              ".00000000000000.",
              "...0000000000...",
              "................",
              "................",
          ],
          images: {}
      },
      D: {
          data: ["................",
              ".000000000000...",
              ".00000000000000.",
              ".0000......0000.",
              ".0000......0000.",
              "...........0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".00000000000000.",
              ".000000000000...",
              "................",
              "................",
          ],
          images: {}
      },
      E: {
          data: ["................",
              ".00000000000000.",
              ".00000000000000.",
              ".0000...........",
              ".0000...........",
              "................",
              ".000000000......",
              ".000000000......",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".00000000000000.",
              ".00000000000000.",
              "................",
              "................",
          ],
          images: {}
      },
      F: {
          data: ["................",
              ".00000000000000.",
              ".00000000000000.",
              ".0000...........",
              ".0000...........",
              "................",
              ".000000000......",
              ".000000000......",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              "................",
              "................",
          ],
          images: {}
      },
      G: {
          data: ["................",
              "...0000000000...",
              ".00000000000000.",
              ".0000......0000.",
              ".0000......0000.",
              "................",
              ".0000...........",
              ".0000...0000000.",
              ".0000...0000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".00000000000000.",
              "...0000000000...",
              "................",
              "................",
          ],
          images: {}
      },
      H: {
          data: ["................",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "...........0000.",
              ".0000......0000.",
              ".00000000000000.",
              ".00000000000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      I: {
          data: ["................",
              "....00000000....",
              "....00000000....",
              "......0000......",
              "......0000......",
              "................",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              ".....000000.....",
              ".....000000.....",
              "................",
              "................",
          ],
          images: {}
      },
      J: {
          data: ["................",
              "..........0000..",
              "..........0000..",
              "..........0000..",
              "..........0000..",
              "................",
              "..........0000..",
              "..........0000..",
              "..........0000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".0000000000000..",
              "...000000000....",
              "................",
              "................",
          ],
          images: {}
      },
      K: {
          data: ["................",
              ".0000......0000.",
              ".0000.....0000..",
              ".0000....0000...",
              ".0000...0000....",
              ".......0000.....",
              ".000000000......",
              ".00000000.......",
              ".0000.0000......",
              ".0000..0000.....",
              ".0000...0000....",
              ".0000....0000...",
              ".0000.....0000..",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      L: {
          data: ["................",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              "................",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000000000000..",
              ".0000000000000..",
              "................",
              "................",
          ],
          images: {}
      },
      M: {
          data: ["...............",
              ".0000......0000.",
              ".0000......0000.",
              ".00000....00000.",
              ".000000..000000.",
              ".....0000000000.",
              ".00000000000000.",
              ".00000000000000.",
              ".0000.0000.0000.",
              ".0000..00..0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      N: {
          data: ["...............",
              ".0000......0000.",
              ".00000.....0000.",
              ".000000....0000.",
              ".0000000...0000.",
              "...........0000.",
              ".000000000.0000.",
              ".00000000000000.",
              ".0000.000000000.",
              ".0000..00000000.",
              ".0000...0000000.",
              ".0000....000000.",
              ".0000.....00000.",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      O: {
          data: ["................",
              "...0000000000...",
              ".00000000000000.",
              ".0000......0000.",
              ".0000......0000.",
              "...........0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".00000000000000.",
              "...0000000000...",
              "................",
              "................",
          ],
          images: {}
      },
      P: {
          data: ["................",
              ".00000000000....",
              ".0000000000000..",
              ".0000......0000.",
              ".0000......0000.",
              "...........0000.",
              ".0000......0000.",
              ".0000000000000..",
              ".00000000000....",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              "................",
              "................",
          ],
          images: {}
      },
      Q: {
          data: ["................",
              "...0000000000...",
              ".00000000000000.",
              ".0000......0000.",
              ".0000......0000.",
              "...........0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000..00000000.",
              ".00000000000000.",
              "...0000000000...",
              "..........0000..",
              "................",
          ],
          images: {}
      },
      R: {
          data: ["................",
              ".00000000000....",
              ".0000000000000..",
              ".0000......0000.",
              ".0000......0000.",
              "...........0000.",
              ".0000......0000.",
              ".0000000000000..",
              ".00000000000....",
              ".0000..0000.....",
              ".0000...0000....",
              ".0000....0000...",
              ".0000.....0000..",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      S: {
          data: ["................",
              "...000000000....",
              ".0000000000000..",
              ".0000.....0000..",
              ".0000.....0000..",
              "................",
              "..0000000.......",
              "....00000000....",
              ".......0000000..",
              "..........0000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".0000000000000..",
              "...000000000....",
              "................",
              "................",
          ],
          images: {}
      },
      T: {
          data: ["................",
              ".00000000000000.",
              ".00000000000000.",
              ".00000000000000.",
              "......0000......",
              "................",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "................",
          ],
          images: {}
      },
      U: {
          data: ["................",
              ".0000.....0000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".0000.....0000..",
              "................",
              ".0000.....0000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".0000000000000..",
              "...000000000....",
              "................",
              "................",
          ],
          images: {}
      },
      V: {
          data: ["................",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "..0000....0000..",
              "..........0000..",
              "..0000....0000..",
              "...0000..0000...",
              "...0000..0000...",
              "....00000000....",
              "....00000000....",
              ".....000000.....",
              ".....000000.....",
              "......0000......",
              "................",
              "................",
          ],
          images: {}
      },
      W: {
          data: ["...............",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".......00..0000.",
              ".0000.0000.0000.",
              ".00000000000000.",
              ".00000000000000.",
              ".00000000000000.",
              ".000000..000000.",
              ".00000....00000.",
              ".0000......0000.",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      X: {
          data: ["...............",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "..0000....0000..",
              ".........0000...",
              "....00000000....",
              ".....000000.....",
              "....00000000....",
              "...0000..0000...",
              "..0000....0000..",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      Y: {
          data: ["...............",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "..0000....0000..",
              ".........0000...",
              "....00000000....",
              ".....000000.....",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "................",
          ],
          images: {}
      },
      Z: {
          data: ["................",
              ".00000000000000.",
              ".00000000000000.",
              ".0000000000000..",
              ".........0000...",
              "................",
              ".......0000.....",
              "......0000......",
              ".....0000.......",
              "....0000........",
              "...0000.........",
              "..0000000000000.",
              ".00000000000000.",
              ".00000000000000.",
              "................",
              "................",
          ],
          images: {}
      },
      0: {
          data: ["................",
              "...0000000000...",
              ".00000000000000.",
              ".0000.....00000.",
              ".0000....000000.",
              "........0000000.",
              ".0000..00000000.",
              ".0000.0000.0000.",
              ".00000000..0000.",
              ".0000000...0000.",
              ".000000....0000.",
              ".00000.....0000.",
              ".00000000000000.",
              "...0000000000...",
              "................",
              "................",
          ],
          images: {}
      },
      1: {
          data: ["................",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "................",
          ],
          images: {}
      },
      2: {
          data: ["................",
              "...0000000000...",
              ".0000000000000..",
              ".0000000000000..",
              ".0000.....0000..",
              ".0000...........",
              "........00000...",
              ".......00000....",
              ".....00000......",
              "....00000.......",
              "...0000.........",
              "..000000000000..",
              ".0000000000000..",
              ".0000000000000..",
              "................",
              "................",
          ],
          images: {}
      },
      3: {
          data: ["................",
              "...0000000000...",
              ".0000000000000..",
              ".0000000000000..",
              ".0000.....0000..",
              ".0000...........",
              "........00000...",
              ".......00000....",
              "........00000...",
              ".0000.....0000..",
              ".0000.....0000..",
              ".0000000000000..",
              ".0000000000000..",
              "...0000000000...",
              "................",
              "................",
          ],
          images: {}
      },
      4: {
          data: ["................",
              "..........0000..",
              ".........00000..",
              "........000000..",
              ".......0000000..",
              "......0000......",
              ".....0000.0000..",
              "....0000..0000..",
              "...0000...0000..",
              "..0000000000000.",
              "..0000000000000.",
              "..0000000000000.",
              "..........0000..",
              "..........0000..",
              "................",
              "................",
          ],
          images: {}
      },
      5: {
          data: ["................",
              ".0000000000000..",
              ".0000000000000..",
              ".0000000000000..",
              ".0000...........",
              "................",
              ".0000000000.....",
              ".000000000000...",
              ".....000000000..",
              "..........0000..",
              ".0000.....0000..",
              ".00000...00000..",
              ".000000000000...",
              "...000000000....",
              "................",
              "................",
          ],
          images: {}
      },
      6: {
          data: ["................",
              "...0000000000...",
              ".000000000000...",
              ".000000000000...",
              ".0000...........",
              "................",
              ".0000000000.....",
              ".000000000000...",
              ".0000000000000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".00000...00000..",
              "..00000000000...",
              "...000000000....",
              "................",
              "................",
          ],
          images: {}
      },
      7: {
          data: ["................",
              ".00000000000000.",
              ".00000000000000.",
              ".00000000000000.",
              "..........0000..",
              "................",
              "........0000....",
              ".......0000.....",
              "......0000......",
              ".....0000.......",
              "....0000........",
              "...0000.........",
              "..0000..........",
              ".0000...........",
              "................",
              "................",
          ],
          images: {}
      },
      8: {
          data: ["................",
              "...000000000....",
              ".0000000000000..",
              ".00000...00000..",
              ".0000.....0000..",
              ".........0000...",
              "...000000000....",
              "...000000000....",
              "..00000000000...",
              ".00000...00000..",
              ".0000.....0000..",
              ".00000...00000..",
              "..00000000000...",
              "...000000000....",
              "................",
              "................",
          ],
          images: {}
      },
      9: {
          data: ["................",
              "....000000000...",
              "...00000000000..",
              "..00000...00000.",
              "..0000.....0000.",
              "...........0000.",
              "..0000000000000.",
              "...000000000000.",
              ".....0000000000.",
              "...........0000.",
              "...........0000.",
              "...000000000000.",
              "...000000000000.",
              "...0000000000...",
              "................",
              "................",
          ],
          images: {}
      },
      '!': {
          data: ["................",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "................",
          ],
          images: {}
      },
      '?': {
          data: ["................",
              "...0000000000...",
              ".0000000000000..",
              ".0000000000000..",
              ".0000.....0000..",
              ".0000...........",
              "........00000...",
              ".......00000....",
              ".....00000......",
              ".....0000.......",
              "................",
              ".....0000.......",
              ".....0000.......",
              ".....0000.......",
              "................",
              "................",
          ],
          images: {}
      },
      '.': {
          data: ["................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "...0000.........",
              "...0000.........",
              "...0000.........",
              "................",
              "................",
          ],
          images: {}
      },
      ',': {
          data: ["................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "...0000.........",
              "...0000.........",
              "...0000.........",
              ".....00.........",
              ".....0..........",
          ],
          images: {}
      },
      "'": {
          data: ["................",
              "......0000......",
              "......0000......",
              "......0000......",
              "........00......",
              "........0.......",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
          ],
          images: {}
      },
  },

  military: {
      bCaseless: true,
      Empty: {
          data: ["................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
          ],
          images: {}
      },
      A: {
          data: ["................",
              "....000..000....",
              "...0000..0000...",
              "..000......000..",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".000000..000000.",
              ".000000..000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      B: {
          data: ["................",
              ".000000..0000...",
              ".000000..000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".000000..0000...",
              ".000000..0000...",
              ".000000..000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".000000..000000.",
              ".000000..0000...",
              "................",
              "................",
          ],
          images: {}
      },
      C: {
          data: ["................",
              "...0000..0000...",
              ".000000..000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000......0000.",
              ".0000......0000.",
              ".000000..000000.",
              "...0000..0000...",
              "................",
              "................",
          ],
          images: {}
      },
      D: {
          data: ["................",
              ".000000..0000...",
              ".000000..000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".000000..000000.",
              ".000000..0000...",
              "................",
              "................",
          ],
          images: {}
      },
      E: {
          data: ["................",
              ".0000..00000000.",
              ".0000..00000000.",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000..000......",
              ".0000..000......",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000..00000000.",
              ".0000..00000000.",
              "................",
              "................",
          ],
          images: {}
      },
      F: {
          data: ["................",
              ".0000..00000000.",
              ".0000..00000000.",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000..000......",
              ".0000..000......",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              "................",
              "................",
          ],
          images: {}
      },
      G: {
          data: ["................",
              "...00..000000...",
              ".0000..00000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000...........",
              ".0000...........",
              ".0000...0000000.",
              ".0000...0000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000..00000000.",
              "...00..000000...",
              "................",
              "................",
          ],
          images: {}
      },
      H: {
          data: ["................",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".000000..000000.",
              ".000000..000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      I: {
          data: ["................",
              "...00.0000.00...",
              "...00.0000.00...",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "...00.0000.00...",
              "...00.0000.00...",
              "................",
              "................",
          ],
          images: {}
      },
      J: {
          data: ["................",
              "..........0000..",
              "..........0000..",
              "..........0000..",
              "..........0000..",
              "..........0000..",
              "..........0000..",
              "..........0000..",
              "..........0000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".00000..000000..",
              "...000..0000....",
              "................",
              "................",
          ],
          images: {}
      },
      K: {
          data: ["................",
              ".0000......0000.",
              ".0000.....0000..",
              ".0000....0000...",
              ".0000...0000....",
              ".0000..0000.....",
              ".0000..000......",
              ".0000..00.......",
              ".0000..000......",
              ".0000..0000.....",
              ".0000...0000....",
              ".0000....0000...",
              ".0000.....0000..",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      L: {
          data: ["................",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000..0000000..",
              ".0000..0000000..",
              "................",
              "................",
          ],
          images: {}
      },
      M: {
          data: ["...............",
              ".0000......0000.",
              ".0000......0000.",
              ".00000....00000.",
              "..00000..000000.",
              ".0.00000.000000.",
              ".00.00000.00000.",
              ".000.00000.0000.",
              ".0000.0000.0000.",
              ".0000..00..0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      N: {
          data: ["...............",
              ".0000......0000.",
              ".00000.....0000.",
              "..00000....0000.",
              ".0.00000...0000.",
              ".00.00000..0000.",
              ".000.00000.0000.",
              ".0000.00000.000.",
              ".0000.000000.00.",
              ".0000..000000.0.",
              ".0000...000000..",
              ".0000....000000.",
              ".0000.....00000.",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      O: {
          data: ["................",
              "...0000..0000...",
              ".000000..000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".000000..000000.",
              "...0000..0000...",
              "................",
              "................",
          ],
          images: {}
      },
      P: {
          data: ["................",
              ".000000..000....",
              ".000000..00000..",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".000000..00000..",
              ".000000..000....",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              ".0000...........",
              "................",
              "................",
          ],
          images: {}
      },
      Q: {
          data: ["................",
              "...0000..0000...",
              ".000000..000000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000...000.000.",
              ".000000.0000.00.",
              "...00000.0000...",
              "..........0000..",
              "................",
          ],
          images: {}
      },
      R: {
          data: ["................",
              ".0000..00000....",
              ".0000..0000000..",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000..00.0000..",
              ".0000..000.0....",
              ".0000..0000.....",
              ".0000...0000....",
              ".0000....0000...",
              ".0000.....0000..",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      S: {
          data: ["................",
              "...0000..000....",
              ".000000..00000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".00000..........",
              "..00000.........",
              "....000..000....",
              ".........00000..",
              "..........0000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".000000..00000..",
              "...0000..000....",
              "................",
              "................",
          ],
          images: {}
      },
      T: {
          data: ["................",
              ".0000.0000.0000.",
              ".0000.0000.0000.",
              ".0000.0000.0000.",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "................",
          ],
          images: {}
      },
      U: {
          data: ["................",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".000000..000000.",
              "...0000..0000...",
              "................",
              "................",
          ],
          images: {}
      },
      V: {
          data: ["................",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "..0000....0000..",
              "..0000....0000..",
              "..0000....0000..",
              "...0000..0000...",
              "...0000..0000...",
              "....0000.000....",
              "....0000.000....",
              ".....0000.0.....",
              ".....00000......",
              "......0000......",
              "................",
              "................",
          ],
          images: {}
      },
      W: {
          data: ["...............",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              ".0000..00..0000.",
              ".0000.0000.0000.",
              ".000..00000.000.",
              ".00.00.00000.00.",
              ".0.0000.00000.0.",
              "..00000..00000..",
              ".00000....00000.",
              ".0000......0000.",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      X: {
          data: ["...............",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "..0000....0000..",
              "...000...0000...",
              "....0.000000....",
              ".....000000.....",
              "....000000.0....",
              "...0000...000...",
              "..0000....0000..",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "................",
              "................",
          ],
          images: {}
      },
      Y: {
          data: ["...............",
              ".0000......0000.",
              ".0000......0000.",
              ".0000......0000.",
              "..0000....0000..",
              "...0000..0000...",
              "....00.00000....",
              "......00000.....",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "................",
          ],
          images: {}
      },
      Z: {
          data: ["................",
              ".0000000000.000.",
              ".000000000.0000.",
              ".00000000.0000..",
              ".........0000...",
              "........0000....",
              ".......0000.....",
              "......0000......",
              ".....0000.......",
              "....0000........",
              "...0000.........",
              "..0000.00000000.",
              ".0000.000000000.",
              ".000.0000000000.",
              "................",
              "................",
          ],
          images: {}
      },
      0: {
          data: ["................",
              "...00000000.....",
              ".000000000.000..",
              ".0000.....0000..",
              ".0000....0000.0.",
              ".0000...0000.00.",
              ".0000..0000.000.",
              ".0000.0000.0000.",
              ".000.0000..0000.",
              ".00.0000...0000.",
              ".0.0000....0000.",
              "..0000.....0000.",
              "..000.000000000.",
              ".....00000000...",
              "................",
              "................",
          ],
          images: {}
      },
      1: {
          data: ["................",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "................",
          ],
          images: {}
      },
      2: {
          data: ["................",
              "...000000000....",
              ".0000000000.00..",
              ".000000000.000..",
              ".0000.....0000..",
              ".0000....0000...",
              "........00000...",
              ".......00000....",
              ".....00000......",
              "....00000.......",
              "...0000.........",
              "..0000.0000000..",
              ".0000.00000000..",
              ".000.000000000..",
              "................",
              "................",
          ],
          images: {}
      },
      3: {
          data: ["................",
              "...0000..0000...",
              ".000000..00000..",
              ".000000..00000..",
              ".0000.....0000..",
              ".0000....0000...",
              "........00000...",
              ".......00000....",
              "........00000...",
              ".0000.....0000..",
              ".0000.....0000..",
              ".000000..00000..",
              ".000000..00000..",
              "...0000..0000...",
              "................",
              "................",
          ],
          images: {}
      },
      4: {
          data: ["................",
              "..........0000..",
              "..........0000..",
              "..........0000..",
              ".......0..0000..",
              "......00..0000..",
              ".....000..0000..",
              "....0000..0000..",
              "...0000...0000..",
              "..000000..00000.",
              "..000000..00000.",
              "..000000..00000.",
              "..........0000..",
              "..........0000..",
              "................",
              "................",
          ],
          images: {}
      },
      5: {
          data: ["................",
              ".000000..00000..",
              ".000000..00000..",
              ".000000..00000..",
              ".0000...........",
              ".0000...........",
              ".000000..00.....",
              ".000000..0000...",
              ".....00..00000..",
              "..........0000..",
              ".0000.....0000..",
              ".00000...00000..",
              ".000000..0000...",
              "...0000..000....",
              "................",
              "................",
          ],
          images: {}
      },
      6: {
          data: ["................",
              "...0000..0000...",
              ".000000..0000...",
              ".000000..0000...",
              ".0000...........",
              ".0000...........",
              ".000000..00.....",
              ".000000..0000...",
              ".000000..00000..",
              ".0000.....0000..",
              ".0000.....0000..",
              ".00000...00000..",
              "..00000..0000...",
              "...0000..000....",
              "................",
              "................",
          ],
          images: {}
      },
      7: {
          data: ["................",
              ".00000000000.00.",
              ".0000000000.000.",
              "...........0000.",
              "..........0000..",
              ".........0000...",
              "........0000....",
              ".......0000.....",
              "......0000......",
              ".....0000.......",
              "....0000........",
              "...0000.........",
              "..0000..........",
              ".0000...........",
              "................",
              "................",
          ],
          images: {}
      },
      8: {
          data: ["................",
              "...0000...000...",
              ".000000...00000.",
              ".00000....00000.",
              ".0000......0000.",
              "..0000....0000..",
              "...0000..0000...",
              "...0000..0000...",
              "..00000..00000..",
              ".00000....00000.",
              ".0000......0000.",
              ".00000....00000.",
              "..00000..00000..",
              "...0000..0000...",
              "................",
              "................",
          ],
          images: {}
      },
      9: {
          data: ["................",
              "....0000..000...",
              "...00000..0000..",
              "..00000...00000.",
              "..0000.....0000.",
              "..0000.....0000.",
              "..000000..00000.",
              "...00000..00000.",
              ".....000..00000.",
              "...........0000.",
              "...........0000.",
              "...00000..00000.",
              "...00000..00000.",
              "...00000..000...",
              "................",
              "................",
          ],
          images: {}
      },
      '!': {
          data: ["................",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "................",
          ],
          images: {}
      },
      '?': {
          data: ["................",
              "...0000000000...",
              ".0000000000000..",
              ".00000...00000..",
              ".0000.....0000..",
              ".0000....0000...",
              "........00000...",
              ".......00000....",
              ".....00000......",
              ".....0000.......",
              "................",
              ".....0000.......",
              ".....0000.......",
              ".....0000.......",
              "................",
              "................",
          ],
          images: {}
      },
      ':': {
          data: ["................",
              "................",
              "................",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "................",
              "................",
              "................",
              "................",
              "......0000......",
              "......0000......",
              "......0000......",
              "................",
              "................",
          ],
          images: {}
      },
      '.': {
          data: ["................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "...0000.........",
              "...0000.........",
              "...0000.........",
              "................",
              "................",
          ],
          images: {}
      },
      ',': {
          data: ["................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "...0000.........",
              "...0000.........",
              "...0000.........",
              ".....00.........",
              ".....0..........",
          ],
          images: {}
      },
      "'": {
          data: ["................",
              "......0000......",
              "......0000......",
              "......0000......",
              "........00......",
              "........0.......",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
          ],
          images: {}
      },
      "<": {
          data: ["................",
              ".........0000...",
              "........0000....",
              ".......0000.....",
              "......0000......",
              ".....0000.......",
              "....0000........",
              "...0000.........",
              "....00.0........",
              "......000.......",
              "......0000......",
              ".......0000.....",
              "........0000....",
              ".........0000...",
              "................",
              "................",
          ],
          images: {}
      },
      ">": {
          data: ["................",
              "...0000.........",
              "....0000........",
              ".....0000.......",
              "......0000......",
              ".......000......",
              "........0.00....",
              ".........0000...",
              "........0000....",
              ".......0000.....",
              "......0000......",
              ".....0000.......",
              "....0000........",
              "...0000.........",
              "................",
              "................",
          ],
          images: {}
      },
      "-": {
          data: ["................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              ".000000.000000..",
              ".000000.000000..",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
              "................",
          ],
          images: {}
      },
      "*": {
          data: ["................",
              "................",
              "................",
              "................",
              ".......0........",
              "....0..0..0.....",
              ".....0.0.0......",
              "......000.......",
              "...000000000....",
              "......000.......",
              ".....0.0.0......",
              "....0..0..0.....",
              ".......0........",
              "................",
              "................",
              "................",
          ],
          images: {}
      },
  }
};

//////////////////////////////////////////////////////////////////////////////////
//   .oooooo.    ooooo        oooooo   oooo ooooooooo.   ooooo   ooooo  .oooooo.o 
//  d8P'  `Y8b   `888'         `888.   .8'  `888   `Y88. `888'   `888' d8P'    `Y8 
// 888            888           `888. .8'    888   .d88'  888     888  Y88bo.      
// 888            888            `888.8'     888ooo88P'   888ooooo888   `"Y8888o.  
// 888     ooooo  888             `888'      888          888     888       `"Y88b 
// `88.    .88'   888       o      888       888          888     888  oo     .d8P 
//  `Y8bood8P'   o888ooooood8     o888o     o888o        o888o   o888o 8""88888P'  
// GLYPHS ////////////////////////////////////////////////////////////////////////
// Glyphs are pre-defined images that can be used for games and such.
// Glyphs are defined in code using an array of strings, where each
// pair of characters represents a hexidecimal lookup into one of
// 16 palettes, each of 16 colors. 00 always equals transparency.
jb.glyphs = {
  glyphInfo: {
      size: "0",
      name: "",
      glyph: null
  },

  draw: function(sizeStr, glyphName, x, y, scaleX, scaleY, anchorX, anchorY) {
      jb.glyphs.drawToContext(jb.ctxt, sizeStr, glyphName, x, y, scaleX, scaleY, anchorX, anchorY);
  },

  find: function(glyphName) {
      var key = null;

      this.glyphInfo.size = "0";
      this.glyphInfo.name = "";
      this.glyphInfo.glyph = null;

      for (key in jb.glyphs) {
          if (/[0-9]+[x][0-9]+/.exec(key)) {
              if (jb.glyphs[key][glyphName]) {
                  this.glyphInfo.size = key;
                  this.glyphInfo.name = glyphName;
                  this.glyphInfo.glyph = jb.glyphs[key][glyphName];
                  break;
              }
          }
      }

      return this.glyphInfo.glyph ? this.glyphInfo : null;
  },

  // The top and left values will represent offsets from (0, 0) at
  // which the bounds begin.
  getBounds: function(sizeStr, glyphName, scaleX, scaleY, result) {
      var glyphsAtSize = jb.glyphs[sizeStr],
          glyphData = glyphsAtSize ? glyphsAtSize[glyphName] : null,
          sx = scaleX || 1,
          sy = scaleY || 1,
          key = "" + scaleX + "x" + scaleY,
          xMin = Number.MAX_SAFE_INTEGER,
          yMin = Number.MAX_SAFE_INTEGER,
          xMax = 0,
          yMax = 0,
          iRow = 0,
          iCol = 0,
          colStart = 0,
          colEnd = 0,
          dCol = 0,
          rowStart = 0,
          rowEnd = 0,
          dRow = 0,
          pixelVal;

      if (glyphData) {
          if (!glyphData.defaultBounds) {
              if (glyphData.pixelData) {
                  rowStart = sy > 0 ? 0 : glyphData.pixelData.length - 1;
                  rowEnd = sy > 0 ? glyphData.pixelData.length : -1;
                  dRow = sy > 0 ? 1 : -1;
                  colStart = sx > 0 ? 0 : glyphData.pixelData[0].length - 2;
                  colEnd = sx > 0 ? glyphData.pixelData[0].length : -1;
                  dCol = sx > 0 ? 2 : -2;

                  iRow = rowStart;
                  do {
                      iCol = colStart;
                      do {
                          pixelVal = parseInt("" + glyphData.pixelData[iRow][iCol] + glyphData.pixelData[iRow][iCol + 1]);
                          if (!isNaN(pixelVal)) {
                              if (iRow < yMin) {
                                  yMin = iRow;
                              } else if (iRow > yMax) {
                                  yMax = iRow;
                              }

                              if (iCol < xMin) {
                                  xMin = iCol;
                              } else if (iCol > xMax) {
                                  xMax = iCol;
                              }
                          }
                          iCol += dCol;
                      } while (iCol !== colEnd)

                      iRow += dRow;
                  } while (iRow !== rowEnd)

                  glyphData.defaultBounds = new jb.bounds(xMin, yMin, (xMax - xMin) / 2, yMax - yMin);
              }
          }

          glyphData.defaultBounds.copyTo(result);
          result.scale(sx, sy);
      }
  },

  drawToContext: function(ctxt, sizeStr, glyphName, x, y, scaleX, scaleY, anchorX, anchorY) {
      var glyphsAtSize = jb.glyphs[sizeStr],
          glyphData = glyphsAtSize ? glyphsAtSize[glyphName] : null,
          sx = scaleX || 1,
          sy = scaleY || 1,
          key = "" + sx + "x" + sy,
          image = null;

      anchorX = anchorX ? anchorX : 0;
      anchorY = anchorY ? anchorY : 0;

      if (jb.ctxt && glyphData) {
          if (!glyphData.image || !glyphData.image[key]) {
              jb.glyphs.init(sizeStr, glyphName, key, sx, sy);
          }

          image = glyphData.image[key];

          x = x - Math.round(anchorX * image.width);
          y = y - Math.round(anchorY * image.height);
          ctxt.drawImage(image, x, y);
      }
  },

  init: function(sizeStr, glyphName, key, scaleX, scaleY) {
      var glyphAtSize = jb.glyphs[sizeStr],
          glyphData = glyphAtSize ? glyphAtSize[glyphName] : null,
          pixelData = glyphData ? glyphData.pixelData : null,
          glyphImage = glyphData ? glyphData.image : null,
          iRow = 0,
          iCol = 0,
          x = 0,
          y = 0,
          iPalette = 0,
          iColor = 0,
          glyph = null,
          glyphCanvas = null,
          glyphCtxt = null,
          pixel = null,
          row = 0,
          col = 0,
          bFlipRow = scaleY < 0,
          bFlipCol = scaleX < 0;

      scaleX = Math.abs(scaleX);
      scaleY = Math.abs(scaleY);

      if (pixelData && !glyphImage) {
          // Create a new object to hold the glyph at all desired scales.
          glyphImage = {};
          glyphData.image = glyphImage;
      }

      if (pixelData && !glyphImage[key]) {
          glyphCanvas = document.createElement('canvas');
          glyphCanvas.width = pixelData[0].length / 2 * scaleX;
          glyphCanvas.height = pixelData.length * scaleY;
          glyphCtxt = glyphCanvas.getContext('2d');
          glyphCtxt.clearRect(0, 0, glyphCanvas.width * scaleX, glyphCanvas.height * scaleY);

          for (iRow = 0; iRow < pixelData.length; ++iRow) {
              row = bFlipRow ? pixelData.length - 1 - iRow : iRow;

              for (iCol = 0; iCol < pixelData[iRow].length; iCol += 2) {
                  col = bFlipCol ? pixelData[0].length - 1 - iCol : iCol;

                  iPalette = parseInt(pixelData[row].charAt(col), 16);
                  iColor = parseInt(pixelData[row].charAt(col + 1), 16);

                  if (isNaN(iPalette) || isNaN(iColor)) {
                      // Skip to next pixel.
                      continue;
                  }

                  glyphCtxt.fillStyle = jb.glyphs.palettes[iPalette][iColor];
                  if (scaleX > 0) {
                      x = iCol / 2 * scaleX;
                  } else {
                      x = (pixelData[0].length / 2 - 2 * (iCol + 1)) * scaleX;
                  }

                  if (scaleY > 0) {
                      y = iRow * scaleY;
                  } else {
                      y = (pixelData.length - (iRow + 1)) * scaleY;
                  }

                  glyphCtxt.fillRect(x, y, scaleX, scaleY);
              }
          }

          glyphData.image[key] = glyphCanvas;
      }

      return glyphImage;
  },

  "8x8": {
      empty: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,",
          ],
      },
      bullet03: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,",
              ".,.,.,0303.,.,.,",
              ".,.,03030303.,.,",
              ".,.,03030303.,.,",
              ".,.,.,0303.,.,.,",
              ".,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,",
          ],
      },
      missile03up: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,03.,.,.,",
              ".,.,.,030303.,.,",
              ".,.,.,.,03.,.,.,",
              ".,.,.,.,03.,.,.,",
              ".,.,.,030303.,.,",
              ".,.,0303030303.,",
              ".,.,.,070D07.,.,",
              ".,.,.,.,07.,.,.,",
          ],
      },
      missile03up2: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,03.,.,.,",
              ".,.,.,030303.,.,",
              ".,.,.,.,03.,.,.,",
              ".,.,.,.,03.,.,.,",
              ".,.,.,030303.,.,",
              ".,.,0303030303.,",
              ".,.,.,.,07.,.,.,",
              ".,.,.,.,.,.,.,.,",
          ],
      },
      torpedoLeft: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,",
              ".,03030303.,0303",
              "03030303030303.,",
              ".,03030303.,0303",
              ".,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,",
          ],
      },
  },

  "16x16": {
      // Ideas for other images:
      // Chess pieces
      // Card suits
      // Weather icons

      empty: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      cloud03: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,0303030303.,.,",
              ".,.,.,.,.,.,.,.,.,030303030303.,",
              ".,030303.,.,.,0303030303030303.,",
              ".,.,03030303030303030303.,03.,.,",
              ".,030303.,0303030303.,.,030303.,",
              "030303030303.,.,030303.,03030303",
              ".,.,030303.,.,.,.,.,0303030303.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      cloud02: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,.,.,03030303.,",
              ".,.,.,03030303030303030303.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,0303030303030303",
              ".,.,.,.,.,030303030303.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      submarineLeft: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,03.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,03.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,030303.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,020203.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,.,.,.,.,.,.,.,",
              "03030303030303030303030303.,.,.,",
              "030302030303030303030303030303.,",
              "03030202020203030303030303030303",
              ".,03030303030303030303030303.,.,",
              ".,.,0303030303030303.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      destroyerRight: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,03.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,03.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,030303.,.,.,.,.,.,",
              ".,0303.,.,.,.,030303.,.,.,030303",
              ".,030303.,.,0303030303.,0303.,.,",
              "03030303030303030303030303030303",
              "03020202020202020202020202020203",
              ".,0303030303030303030303030303.,",
              ".,0303030303030303030303030303.,",
              ".,.,030303030303030303030303.,.,",
              ".,.,030303030303030303030303.,.,",
          ],
      },
      shieldEmpty: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,0303030303030303030303030303.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,.,03.,.,.,.,.,.,.,.,.,.,03.,.,",
              ".,.,.,03.,.,.,.,.,.,.,.,03.,.,.,",
              ".,.,.,.,03.,.,.,.,.,.,03.,.,.,.,",
              ".,.,.,.,.,030303030303.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      shieldHorse: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,0303030303030303030303030303.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,0303.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,030303.,.,.,.,.,03.,",
              ".,03.,.,.,0303.,0303.,.,.,.,03.,",
              ".,03.,.,.,.,0303030303.,.,.,03.,",
              ".,03.,.,.,030303030303,..,.,03.,",
              ".,03.,.,.,.,030303.,.,.,.,.,03.,",
              ".,03.,.,.,03030303.,.,.,.,.,03.,",
              ".,03.,.,.,.,03030303.,.,.,.,03.,",
              ".,.,03.,.,030303030303.,.,03.,.,",
              ".,.,.,03.,030303030303.,03.,.,.,",
              ".,.,.,.,03.,.,.,.,.,.,03.,.,.,.,",
              ".,.,.,.,.,030303030303.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      shieldSword: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,0303030303030303030303030303.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,.,.,.,.,0303.,.,03.,",
              ".,03.,.,.,.,.,.,.,030303.,.,03.,",
              ".,03.,.,.,.,.,.,030303.,.,.,03.,",
              ".,03.,.,.,.,.,030303.,.,.,.,03.,",
              ".,03.,.,03.,030303.,.,.,.,.,03.,",
              ".,03.,.,.,030303.,.,.,.,.,.,03.,",
              ".,03.,.,.,0303.,.,.,.,.,.,.,03.,",
              ".,03.,.,03.,.,03.,.,.,.,.,.,03.,",
              ".,.,03.,.,.,.,.,.,.,.,.,.,03.,.,",
              ".,.,.,03.,.,.,.,.,.,.,.,03.,.,.,",
              ".,.,.,.,03.,.,.,.,.,.,03.,.,.,.,",
              ".,.,.,.,.,030303030303.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      shieldAnvil: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,0303030303030303030303030303.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,03.,",
              ".,03.,.,030303030303030303.,03.,",
              ".,03.,.,0303030303030303.,.,03.,",
              ".,03.,.,.,0303030303.,.,.,.,03.,",
              ".,03.,.,.,0303030303.,.,.,.,03.,",
              ".,03.,.,.,.,.,0303.,.,.,.,.,03.,",
              ".,03.,.,.,.,03030303.,.,.,.,03.,",
              ".,.,03.,.,.,.,.,.,.,.,.,.,03.,.,",
              ".,.,.,03.,.,.,.,.,.,.,.,03.,.,.,",
              ".,.,.,.,03.,.,.,.,.,.,03.,.,.,.,",
              ".,.,.,.,.,030303030303.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      // 0 = black
      // 1 = white
      // 2 = dk gray
      // 3 = lt gray
      // 4 = red
      // 5 = green
      // 6 = blue
      // 7 = yellow
      // 8 = cyan
      // 9 = purple
      // A = dk red
      // B = dk green
      // C = dk blue
      // D = orange
      // E = dk cyan
      // F = brown (dk orange)
      shieldBed: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,0F0F0F0F0F0F0F0F0F0F0F0F0F0F.,",
              ".,0F.,.,.,.,.,.,.,.,.,.,.,.,0F.,",
              ".,0F.,.,.,.,.,.,.,.,.,.,.,.,0F.,",
              ".,0F.,.,.,.,.,.,.,.,.,.,0F.,0F.,",
              ".,0F.,.,.,.,.,.,.,.,.,.,0F.,0F.,",
              ".,0F.,.,.,.,.,.,.,020F0F0F.,0F.,",
              ".,0F.,0C0C0C0C0C0C0C0C0C0F.,0F.,",
              ".,0F.,0C0C0C0C0C0C0C0C0C0F.,0F.,",
              ".,0F.,0F0F0F0F0F0F0F0F0F0F.,0F.,",
              ".,0F.,0F.,.,.,.,.,.,.,.,0F.,0F.,",
              ".,0F.,0F.,.,.,.,.,.,.,.,0F.,0F.,",
              ".,.,0F.,.,.,.,.,.,.,.,.,.,0F.,.,",
              ".,.,.,0F.,.,.,.,.,.,.,.,0F.,.,.,",
              ".,.,.,.,0F.,.,.,.,.,.,0F.,.,.,.,",
              ".,.,.,.,.,0F0F0F0F0F0F.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      shieldTest: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,0F0F0F0F0F0F0F0F0F0F0F0F0F0F.,",
              ".,0F000F0F000F0F000F0F000F0F0F.,",
              ".,0F000F0F000F0F000F0F000F0F0F.,",
              ".,0F000F0F000F0F000F0F000F0F0F.,",
              ".,0F000F0F000F0F000F0F000F0F0F.,",
              ".,0F000F0F000F0F000F0F000F0F0F.,",
              ".,0F000F0F000F0F000F0F000F0F0F.,",
              ".,0F000F0F000F0F000F0F000F0F0F.,",
              ".,0F000F0F000F0F000F0F000F0F0F.,",
              ".,0F000F0F000F0F000F0F000F0F0F.,",
              ".,0F000F0F000F0F000F0F000F0F0F.,",
              ".,.,0F0F0F000F0F000F0F000F02.,.,",
              ".,.,.,0F0F000F0F000F0F000F.,.,.,",
              ".,.,.,.,0F000F0F000F0F02.,.,.,.,",
              ".,.,.,.,.,0F0F0F0F0F0F.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      knight: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,020202.,.,.,.,.,.,.,",
              ".,03.,.,.,.,020302.,.,.,.,.,.,.,",
              ".,03.,.,.,.,020302.,.,.,.,.,.,.,",
              ".,03.,.,030D0202020F02.,.,.,.,.,",
              ".,03.,03020D0D0D0D0F02.,0302.,.,",
              ".,03.,03020D0D0D0D020203030302.,",
              ".,030302.,0D0D0D0D0F.,03030302.,",
              "030303.,.,0303030303.,.,030302.,",
              ".,02.,.,.,030D0D0F02.,.,030302.,",
              ".,.,.,.,03030D.,0F0202.,.,02.,.,",
              ".,.,.,.,030302.,020202.,.,.,.,.,",
              ".,.,.,.,0302.,.,.,0202.,.,.,.,.,",
              ".,.,.,.,0302.,.,.,0202.,.,.,.,.,",
              ".,.,.,.,0302.,.,.,0202.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      thief: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,0F0F0F.,.,.,.,.,.,.,",
              ".,.,.,.,..,.0F110F.,.,.,.,0F.,.,",
              ".,.,.,.,.,.,111111.,.,.,.,.,0F.,",
              ".,.,.,.,.,.,0B110B.,.,.,.,.,0F.,",
              ".,.,.,.,0505050B05050B.,.,.,0F.,",
              ".,.,.,050B05050B0505050B.,.,0F.,",
              ".,.,050B.,05050B05050B050B0F.,.,",
              ".,1111.,.,0303030302.,05110F.,.,",
              ".,11.,.,.,0B0505050B.,.,11.,.,.,",
              ".,.,.,.,.,0B050F050B.,.,.,0F.,.,",
              ".,.,.,.,.,0F0F.,0F0F.,.,.,0F.,.,",
              ".,.,.,.,.,0F0F.,0F0F.,.,.,0F.,.,",
              ".,.,.,.,.,0F0F.,0F0F.,.,0F.,.,.,",
              ".,.,.,.,.,0F0F.,0F0F.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      cleric: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,020202.,.,.,.,.,.,.,",
              "020302.,.,.,021102.,.,.,.,.,.,.,",
              "030303.,.,.,021102.,.,.,.,.,.,.,",
              "020302.,03060602060C02.,.,.,.,.,",
              ".,0F.,0302060606060C02.,0302.,.,",
              ".,0F.,030206060606020203030302.,",
              ".,1111.,.,060606060C.,03030302.,",
              ".,11.,.,.,0303030302.,.,030302.,",
              ".,0F.,.,.,0306060C02.,.,030302.,",
              ".,.,.,.,03030C.,060202.,.,02.,.,",
              ".,.,.,.,030302.,020202.,.,.,.,.,",
              ".,.,.,.,0302.,.,.,0202.,.,.,.,.,",
              ".,.,.,.,0302.,.,.,0202.,.,.,.,.,",
              ".,.,.,.,0302.,.,.,0202.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      mage: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "0F0F0F.,.,.,,.04,..,.,.,.,.,.,.,",
              "0F040F.,.,.,04110A.,.,.,.,.,.,.,",
              "0F0F0F.,.,,.04110A,..,.,.,.,.,.,",
              ".,0F.,.,,.040404040A.,.,.,.,.,.,",
              ".,0F.,,.0404040404040A,.,.,..,.,",
              ".,0F.,040A040404040A0A0F.,.,.,.,",
              ".,0F040A.,040404040A0F0F0F0F.,.,",
              ".,1111.,.,0404040A0F0F0F0F11.,.,",
              ".,11,..,.,.,0303030F0F0F11.,.,.,",
              ".,0F.,.,.,040404040A.,0F.,.,.,.,",
              ".,0F.,.,,.040404040A.,.,.,.,.,.,",
              ".,0F.,.,0404040A04040A.,.,.,.,.,",
              ".,0F.,.,0404040A04040A.,.,.,.,.,",
              ".,0F.,04040404040A04040A.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      hermit: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,0A.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,0A0A0A.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,0A110A0A.,.,.,.,.,",
              ".,.,.,.,.,.,0A0A11110A.,.,.,.,.,",
              ".,.,.,.,.,040A1111110A.,.,.,.,.,",
              ".,.,.,.,04110A0A111411.,11.,.,.,",
              ".,.,.,.,1111.,040404111111.,.,.,",
              ".,.,.,1111.,.,04040A.,11.,.,.,.,",
              ".,.,.,11.,.,.,0A040A.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,04040A.,.,.,.,.,.,",
              ".,.,.,.,.,.,040A0A040A.,.,.,.,.,",
              ".,.,.,.,.,.,040A04040A.,.,.,.,.,",
              ".,.,.,.,.,040A040404040A.,.,.,.,",
              ".,.,.,.,.,040A0404040A0A.,.,.,.,",
              ".,.,.,.,1111.,.,.,.,.,1111.,.,.,",
          ],
      },
      plains01: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ",.,.,.,.0B,.,.,.,.,.,.,.,.,.,.,.",
              ",.0B,.,.0B,.,.,.0B,.,.,.,.,.,.0B",
              ",.,.0B,.0B,.,.,.0B,.0B,.,.,.,.0B",
              ",.,.0B,.,.,.,.,.0B,.0B,.,.,.,.0B",
              ",.,.,.,.,.,.,.,.0B0B,.,.,.,.,.0B",
              "0B,.,.,.0B,.0B,.,.,.,.0B,.,.,.,.",
              "0B,.,.,.0B,.0B,.,.0B,.0B,.,.,.,.",
              ",.0B,.,.,.0B0B,.,.,.0B0B,.,.,.,.",
              ",.0B,.,.,.,.,.,.,.,.,.0B,.,.,.,.",
              ",.,.,.,.,.,.,.,.,.,.0B,.,.0B,.,.",
              ",.0B,.,.,.,.,.,.,.,.,.0B,.0B,.,.",
              ",.,.0B,.0B,.,.0B,.,.,.,.0B,.,.,.",
              ",.,.,.0B,.,.,.0B,.,.,.,.,.,.,.0B",
              ",.0B,.,.,.,.,.0B,.,.0B,.,.,.,.0B",
              ",.0B,.0B,.,.,.0B,.,.0B,.,.,.,.0B",
              ",.,.0B0B,.,.,.,.0B,.0B,.,.,.0B,.",
          ],
      },
      chest01: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,03030303030303030302.,.,.,",
              ".,.,030F0F0F0F0F0F0F0F030F02.,.,",
              ".,030F0F0F0F0F0F0F0F030F000F02.,",
              ".,030F0F0F0F0F0F0F0F03000F0202.,",
              ".,030F0F0F0F0F0F0F0F030F020F02.,",
              ".,03030303030303030303020F0002.,",
              ".,030F0F0F03030F0F0F0F02000F02.,",
              ".,030F0F0F03030F0F0F0F020F0002.,",
              ".,030F0F0F0F0F0F0F0F0F020002.,.,",
              ".,030F0F0F0F0F0F0F0F0F0202.,.,.,",
              ".,0303030303030303030302.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      desert01: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              "00000000000000000000000000000000",
              ".,.,.,.,0F0F07070F0F07070F0F.,.,",
              ".,.,0F0F07070F0F07070F0F07070F0F",
              ".,.,07070F0F07070F0F07070F0F.,.,",
              ".,.,0F0F07070F0F07070F0F07070F0F",
              "0F0F07070F0F07070F0F07070F0F0707",
              ".,.,0F0F07070F0F07070F0F07070F0F",
              "0F0F07070F0F07070F0F07070F0F.,.,",
              "07070F0F07070F0F07070F0F0707.,.,",
              ".,.,07070F0F07070F0F07070F0F0707",
              ".,.,.,.,07070F0F07070F0F07070F0F",
              "0F0F07070F0F07070F0F07070F0F0707",
              ".,.,0F0F07070F0F07070F0F07070F0F",
              "0F0F07070F0F07070F0F07070F0F.,.,",
              ".,.,0F0F07070F0F07070F0F07070F0F",
              ".,.,.,.,0F0F07070F0F07070F0F.,.,",
          ],
      },
      stone01: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,030303.,.,.,.,.,0303.,.,.,",
              ".,.,0302020203.,.,.,0302020303.,",
              ".,03020202020203.,.,0302020002.,",
              ".,03020202020200.,.,.,020002.,.,",
              ".,02020200020002.,.,.,.,.,.,.,.,",
              ".,.,0200020002.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,0302",
              ".,.,.,.,.,.,.,.,.,.,0302.,0302.,",
              ".,.,.,.,.,.,.,.,.,0302.,.,.,.,.,",
              ".,.,.,.,0302.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,0302.,.,.,.,.,.,030303.,.,",
              ".,.,.,.,.,.,.,0302.,0302020003.,",
              ".,.,.,.,.,.,0302.,.,.,020002.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      waterDeep01: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              "00000000000000000000000006060606",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
              "00000000000000000606060600000000",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
              "00000000060606060000000000000000",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
              "06060606000000000000000000000000",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
          ],
      },
      waterDeep02: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              "06060606000000000000000000000000",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
              "00000000000000000000000006060606",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
              "00000000000000000606060600000000",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
              "00000000060606060000000000000000",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
          ],
      },
      waterDeep03: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              "00000000060606060000000000000000",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
              "06060606000000000000000000000000",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
              "00000000000000000000000006060606",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
              "00000000000000000606060600000000",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
          ],
      },
      waterDeep04: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              "00000000000000000606060600000000",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
              "00000000060606060000000000000000",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
              "06060606000000000000000000000000",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
              "00000000000000000000000006060606",
              "06060606060606060606060606060606",
              "06060606060606060606060606060606",
              "00000000000000000000000000000000",
          ],
      },
      water01: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              "00000000060606060000000006060606",
              "00000000060606060000000006060606",
              "06060606000000000606060600000000",
              "06060606000000000606060600000000",
              "00000000060606060000000006060606",
              "00000000060606060000000006060606",
              "06060606000000000606060600000000",
              "06060606000000000606060600000000",
              "00000000060606060000000006060606",
              "00000000060606060000000006060606",
              "06060606000000000606060600000000",
              "06060606000000000606060600000000",
              "00000000060606060000000006060606",
              "00000000060606060000000006060606",
              "06060606000000000606060600000000",
              "06060606000000000606060600000000",
          ],
      },
      water02: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              "00000606060600000000060606060000",
              "00000606060600000000060606060000",
              "06060000000006060606000000000606",
              "06060000000006060606000000000606",
              "00000606060600000000060606060000",
              "00000606060600000000060606060000",
              "06060000000006060606000000000606",
              "06060000000006060606000000000606",
              "00000606060600000000060606060000",
              "00000606060600000000060606060000",
              "06060000000006060606000000000606",
              "06060000000006060606000000000606",
              "00000606060600000000060606060000",
              "00000606060600000000060606060000",
              "06060000000006060606000000000606",
              "06060000000006060606000000000606",
          ],
      },
      water03: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              "06060606000000000606060600000000",
              "06060606000000000606060600000000",
              "00000000060606060000000006060606",
              "00000000060606060000000006060606",
              "06060606000000000606060600000000",
              "06060606000000000606060600000000",
              "00000000060606060000000006060606",
              "00000000060606060000000006060606",
              "06060606000000000606060600000000",
              "06060606000000000606060600000000",
              "00000000060606060000000006060606",
              "00000000060606060000000006060606",
              "06060606000000000606060600000000",
              "06060606000000000606060600000000",
              "00000000060606060000000006060606",
              "00000000060606060000000006060606",
          ],
      },
      water04: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              "06060000000006060606000000000606",
              "06060000000006060606000000000606",
              "00000606060600000000060606060000",
              "00000606060600000000060606060000",
              "06060000000006060606000000000606",
              "06060000000006060606000000000606",
              "00000606060600000000060606060000",
              "00000606060600000000060606060000",
              "06060000000006060606000000000606",
              "06060000000006060606000000000606",
              "00000606060600000000060606060000",
              "00000606060600000000060606060000",
              "06060000000006060606000000000606",
              "06060000000006060606000000000606",
              "00000606060600000000060606060000",
              "00000606060600000000060606060000",
          ],
      },
      tree03: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,050B.,.,.,05.,.,.,",
              ".,.,.,05.,.,.,050B.,.,.,0B05.,.,",
              ".,.,050B05.,0505050B.,0B050B.,.,",
              ".,.,0B050B.,0500B50B.,050B050B.,",
              ".,.,050B0B05050B05050B0B050B05.,",
              ".,050B050B0B0B050B050B050B050B.,",
              ".,.,050B0B050505050B0B0B050B050B",
              ".,0B0B0F0B05050B05050B050F0B0B0B",
              ".,.,.,0F05050B050B05050B0D0F.,.,",
              ".,.,.,.,050B0505050B0B0B0F.,.,.,",
              ".,.,.,.,0B050B050505050B.,.,.,.,",
              ".,.,.,0B050B.,0D0F.,0B050B.,.,.,",
              ".,.,.,.,.,.,.,0D0F.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,0D0F.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      swamp01: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,,.,.,..,.,06.,06.,06.,",
              ".,.,.,.,06.,,.,.,.,.,.060606.,.,",
              ".,.,06.,06.,.,.,.,.,.,,.06,..,.,",
              ".,.,.,060606.,.,.,.,,.,.,.,.,..,",
              ".,06.,0606,..,.,.,06.,.,.,.,.,.,",
              ".,06,.,.,.,.,..,.,06.,06.,.,.,.,",
              "0606.,,.,.,.,.,..,0606.,.,.,.,.,",
              "06,..,.,.,.,.,.,.,0606,..,.,.,.,",
              ",.,.,.,..,.,.,.,,.,.,.,.,..,.,.,",
              ".,.,06.,.,,.,.,.,.,.,..,.,.,06.,",
              ".,.,06.,06.,.,.,,.,..,.,06.,06.,",
              ".,.,.,0606.,06.,.,.,.,.,06.,06.,",
              ".,.,.,060606.,.,.,.,.,.,060606.,",
              ".,.,.,060606.,.,.,.,.,,.,.,.,.,.",
              ".,.,,.,.,.,.,..,.,.,.,.,.,.,.,.,",
          ],
      },
      grid: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              "23.,23.,23.,23.,23.,23.,23.,23.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,23,",
              "23.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,23,",
              "23.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,23,",
              "23.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,23,",
              "23.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,23,",
              "23.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,23,",
              "23.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,23,",
              "23.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,23.,23.,23.,23.,23.,23.,23.,23",
          ],
      },
      invBrickLarge: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,02.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,02.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,02.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,02.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,02.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,02.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,02.,.,.,.,.,.,.,.,.,.,.,",
              "02020202020202020202020202020202",
              ".,.,.,.,.,.,.,.,.,.,.,02.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,02.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,02.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,02.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,02.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,02.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,02.,.,.,.,",
              "02020202020202020202020202020202",
          ],
      },
      invBrickSmall: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,02.,.,.,.,.,.,.,02.,.,.,.,",
              ".,.,.,02.,.,.,.,.,.,.,02.,.,.,.,",
              ".,.,.,02.,.,.,.,.,.,.,02.,.,.,.,",
              "02020202020202020202020202020202",
              ".,.,.,.,.,.,.,02.,.,.,.,.,.,.,02",
              ".,.,.,.,.,.,.,02.,.,.,.,.,.,.,02",
              ".,.,.,.,.,.,.,02.,.,.,.,.,.,.,02",
              "02020202020202020202020202020202",
              ".,.,.,02.,.,.,.,.,.,.,02.,.,.,.,",
              ".,.,.,02.,.,.,.,.,.,.,02.,.,.,.,",
              ".,.,.,02.,.,.,.,.,.,.,02.,.,.,.,",
              "02020202020202020202020202020202",
              ".,.,.,.,.,.,.,02.,.,.,.,.,.,.,02",
              ".,.,.,.,.,.,.,02.,.,.,.,.,.,.,02",
              ".,.,.,.,.,.,.,02.,.,.,.,.,.,.,02",
              "02020202020202020202020202020202",
          ],
      },
      brickTileCheckSmall: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              "02020202.,.,.,.,02020202.,.,.,.,",
              "02020202.,.,.,.,02020202.,.,.,.,",
              "02020202.,.,.,.,02020202.,.,.,.,",
              "02020202.,.,.,.,02020202.,.,.,.,",
              ".,.,.,.,02020202.,.,.,.,02020202",
              ".,.,.,.,02020202.,.,.,.,02020202",
              ".,.,.,.,02020202.,.,.,.,02020202",
              ".,.,.,.,02020202.,.,.,.,02020202",
              "02020202.,.,.,.,02020202.,.,.,.,",
              "02020202.,.,.,.,02020202.,.,.,.,",
              "02020202.,.,.,.,02020202.,.,.,.,",
              "02020202.,.,.,.,02020202.,.,.,.,",
              ".,.,.,.,02020202.,.,.,.,02020202",
              ".,.,.,.,02020202.,.,.,.,02020202",
              ".,.,.,.,02020202.,.,.,.,02020202",
              ".,.,.,.,02020202.,.,.,.,02020202",
          ],
      },
      stonePanel: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              "00000000000000000000000000000000",
              "00020002000200020002000200020302",
              "00000202020202020202020202020302",
              "00020202020202020202020202020302",
              "00000202020202020202020202020302",
              "00020202020202020202020202020302",
              "00000202020202020202020202020302",
              "00020202020202020202020202020302",
              "00000202020202020202020202020302",
              "00020202020202020202020202020302",
              "00000202020202020202020202020302",
              "00020202020202020202020202020302",
              "00000202020202020202020202020302",
              "00020202020202020202020202020302",
              "00000303030303030303030303030302",
              "00020202020202020202020202020202",
          ],
      },
      brickRight: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,.,.,.,.,.,.,.,",
              ".,03030303030303.,.,.,.,.,.,.,.,",
              ".,03030303030303.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "03030303.,030303.,.,.,.,.,.,.,.,",
              "03030303.,030303.,.,.,.,.,.,.,.,",
              "03030303.,030303.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,.,.,.,.,.,.,.,",
              ".,03030303030303.,.,.,.,.,.,.,.,",
              ".,03030303030303.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "03030303.,030303.,.,.,.,.,.,.,.,",
              "03030303.,030303.,.,.,.,.,.,.,.,",
              "03030303.,030303.,.,.,.,.,.,.,.,",
          ],
      },
      brickWedgeTopLeft: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,03",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,03.,030303",
              ".,.,.,.,.,.,.,.,.,.,0303.,030303",
              ".,.,.,.,.,.,.,.,.,030303.,030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,03.,03030303030303",
              ".,.,.,.,.,.,0303.,03030303030303",
              ".,.,.,.,.,030303.,03030303030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,03.,03030303030303.,030303",
              ".,.,0303.,03030303030303.,030303",
              ".,030303.,03030303030303.,030303",
          ],
      },
      brickWedgeTopRight: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,0303.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "03030303.,.,.,.,.,.,.,.,.,.,.,.,",
              "03030303.,03.,.,.,.,.,.,.,.,.,.,",
              "03030303.,0303.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,.,.,.,.,.,.,.,",
              ".,03030303030303.,03.,.,.,.,.,.,",
              ".,03030303030303.,0303.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "03030303.,03030303030303.,.,.,.,",
              "03030303.,03030303030303.,03.,.,",
              "03030303.,03030303030303.,0303.,",
          ],
      },
      brickWedgeBottomLeft: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,030303030303.,03030303030303",
              ".,.,.,0303030303.,03030303030303",
              ".,.,.,.,03030303.,03030303030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,030303030303.,030303",
              ".,.,.,.,.,.,.,0303030303.,030303",
              ".,.,.,.,.,.,.,.,03030303.,030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,030303030303",
              ".,.,.,.,.,.,.,.,.,.,.,0303030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,03030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,03",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      brickWedgeBottomRight: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,0303030303.,.,",
              ".,03030303030303.,03030303.,.,.,",
              ".,03030303030303.,030303.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "03030303.,0303030303.,.,.,.,.,.,",
              "03030303.,03030303.,.,.,.,.,.,.,",
              "03030303.,030303.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,0303030303.,.,.,.,.,.,.,.,.,.,",
              ".,03030303.,.,.,.,.,.,.,.,.,.,.,",
              ".,030303.,.,.,.,.,.,.,.,.,.,.,,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "0303.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "03.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      brickBattlementCenter: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,030303.,030303.,.,.,.,",
              ".,.,.,.,.,030303.,030303.,.,.,.,",
              ".,.,.,.,.,030303.,030303.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "03030303.,03030303030303.,030303",
              "03030303.,03030303030303.,030303",
              "03030303.,03030303030303.,030303",
          ],
      },
      brickBattlementLeft: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,030303.,030303.,.,.,.,",
              ".,.,.,.,.,030303.,030303.,.,.,.,",
              ".,.,.,.,.,030303.,030303.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,03030303030303.,030303",
              ".,.,.,.,.,03030303030303.,030303",
              ".,.,.,.,.,03030303030303.,030303",
          ],
      },
      brickBattlementRight: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,030303.,030303.,.,.,.,",
              ".,.,.,.,.,030303.,030303.,.,.,.,",
              ".,.,.,.,.,030303.,030303.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "03030303.,03030303030303.,.,.,.,",
              "03030303.,03030303030303.,.,.,.,",
              "03030303.,03030303030303.,.,.,.,",
          ],
      },
      brickLeftPoint: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,0303.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,030303.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "03030303.,03.,.,.,.,.,.,.,.,.,.,",
              "03030303.,0303.,.,.,.,.,.,.,.,.,",
              "03030303.,030303.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,030303030303.,.,.,.,.,.,.,.,.,",
              ".,0303030303.,.,.,.,.,.,.,.,.,.,",
              ".,03030303.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "030303.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "0303.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      brickRightPoint: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,03",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,03.,030303",
              ".,.,.,.,.,.,.,.,.,.,0303.,030303",
              ".,.,.,.,.,.,.,.,.,030303.,030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,030303030303",
              ".,.,.,.,.,.,.,.,.,.,.,0303030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,03030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,03",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      brickCenter: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "03030303.,03030303030303.,030303",
              "03030303.,03030303030303.,030303",
              "03030303.,03030303030303.,030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "03030303.,03030303030303.,030303",
              "03030303.,03030303030303.,030303",
              "03030303.,03030303030303.,030303",
          ],
      },
      brickCenterLeft: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,030303.,03030303030303.,030303",
              ".,030303.,03030303030303.,030303",
              ".,030303.,03030303030303.,030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,030303.,03030303030303.,030303",
              ".,030303.,03030303030303.,030303",
              ".,030303.,03030303030303.,030303",
          ],
      },
      brickCenterWindow: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,030303030303.,.,.,030303030303",
              ".,.,.,.,.,03.,.,.,.,.,03.,.,.,.,",
              "03030303.,03.,.,.,.,.,03.,030303",
              "03030303.,03.,.,.,.,.,03.,030303",
              "03030303.,03.,.,.,.,.,03.,030303",
              ".,.,.,.,.,03.,.,.,.,.,03.,.,.,.,",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "03030303.,03030303030303.,030303",
              "03030303.,03030303030303.,030303",
              "03030303.,03030303030303.,030303",
          ],
      },
      brickCenterDoor: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,030303030303030303030303030303",
              ".,0303030F0F0F0F0F0F0F0F03030303",
              ".,03030F0F0F0F0F.,0F0F0F0F0F0303",
              ".,.,0F0F.,0F0F0F.,0F0F0F.,0F.,.,",
              "03030F0F.,0F0F0F.,0F0F0F.,0F0303",
              "03030202020202020202020202020303",
              "03030F0F.,0F0F0F.,0F0F0F.,0F0303",
              ".,.,0F0F.,0F0F0F.,0F0F0F.,0F.,.,",
              ".,030202020F0F0F.,0F0F0F.,0F0303",
              ".,030202020F0F0F.,0F0F0F.,0F0303",
              ".,030F0F.,0F0F0F.,0F0F0F.,0F0303",
              ".,.,0F0F.,0F0F0F.,0F0F0F.,0F.,.,",
              "03030202020202020202020202020303",
              "03030F0F.,0F0F0F.,0F0F0F.,0F0303",
              "03030F0F.,0F0F0F.,0F0F0F.,0F0303",
          ],
      },
      brickCenterDoorway: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,030303030303030303030303030303",
              ".,030303.,.,.,.,.,.,.,.,03030303",
              ".,0303.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "0303.,.,.,.,.,.,.,.,.,.,.,.,0303",
              "0303.,.,.,.,.,.,.,.,.,.,.,.,0303",
              "0303.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              "0303.,.,.,.,.,.,.,.,.,.,.,.,0303",
              "0303.,.,.,.,.,.,.,.,.,.,.,.,0303",
              "0303.,.,.,.,.,.,.,.,.,.,.,.,0303",
          ],
      },
      brickLeft: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,03030303030303",
              ".,.,.,.,.,.,.,.,.,03030303030303",
              ".,.,.,.,.,.,.,.,.,03030303030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,030303.,030303",
              ".,.,.,.,.,.,.,.,.,030303.,030303",
              ".,.,.,.,.,.,.,.,.,030303.,030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,03030303030303",
              ".,.,.,.,.,.,.,.,.,03030303030303",
              ".,.,.,.,.,.,.,.,.,03030303030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,030303.,030303",
              ".,.,.,.,.,.,.,.,.,030303.,030303",
              ".,.,.,.,.,.,.,.,.,030303.,030303",
          ],
      },
      brickTop: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303,.030303.,030303.,030303",
              ".,030303,.,.,.,.,030303.,.,.,.,",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,.,.,.,.,030303.,.,.,.,.,030303",
          ],
      },
      brickMid: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,.,.,.,.,030303.,.,.,.,",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303,.030303.,030303",
              ".,030303.,030303,.030303.,030303",
              ".,.,.,.,.,030303.,.,.,.,.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303,.030303.,030303.,030303",
              ".,030303,.,.,.,.,030303.,.,.,.,",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,.,.,.,.,030303.,.,.,.,.,030303",
          ],
      },
      brickMidWindow: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,0303.,.,.,0303.,.,.,.,",
              ".,030303.,03.,.,.,.,.,03.,030303",
              ".,030303.,03.,.,.,.,.,03.,030303",
              ".,030303.,03.,.,.,.,.,03.,030303",
              ".,.,.,.,.,03.,.,.,.,.,03.,030303",
              ".,030303.,03.,.,.,.,.,03.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303,.030303.,030303.,030303",
              ".,030303,.,.,.,.,030303.,.,.,.,",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,.,.,.,.,030303.,.,.,.,.,030303",
          ],
      },
      brickMidDoor: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,030303.,030303.,030303.,030303",
              ".,030303.,0F0F0F0F0F0F0F.,030303",
              ".,03030F0F0F0F0F.,0F0F0F0F030303",
              ".,030F0F.,0F0F0F.,0F0F0F.,0F.,.,",
              ".,030F0F.,0F0F0F.,0F0F0F.,0F0303",
              ".,030F0F.,0F0F0F,.0F0F0F.,0F0303",
              ".,030202020202020202020202020303",
              ".,.,0F0F.,0F0F0F.,0F0F0F.,0F0303",
              ".,030F0F.,0F0F0F.,0F0F0F.,0F0303",
              ".,030202020F0F0F.,0F0F0F.,0F0303",
              ".,030202020F0F0F.,0F0F0F.,0F0303",
              ".,030F0F,.0F0F0F.,0F0F0F.,0F.,.,",
              ".,030F0F.,0F0F0F.,0F0F0F.,0F0303",
              ".,030202020202020202020202020303",
              ".,030F0F.,0F0F0F.,0F0F0F.,0F0303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      brickMidDoorway: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,030303.,030303.,030303.,030303",
              ".,030303.,.,.,.,.,.,.,.,.,030303",
              ".,0303.,.,.,.,.,.,.,.,.,.,030303",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,03.,.,.,.,.,.,,.,.,.,.,.,0303",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,03.,.,,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,0303",
              ".,03.,.,.,.,.,.,.,.,.,.,.,.,0303",
          ],
      },
      brickBottom: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,.,.,.,.,030303.,.,.,.,",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303,.030303.,030303",
              ".,030303.,030303,.030303.,030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
      brickTopLeft: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,030303.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,030303.,03030303030303.,030303",
              ".,030303.,03030303030303.,030303",
              ".,.,.,.,.,03030303030303.,030303",
              ".,030303.,030303.,.,.,.,.,.,.,.,",
              ".,030303.,030303.,03030303030303",
              ".,030303,.030303.,03030303030303",
              ".,030303,.030303.,03030303030303",
              ".,030303.,.,.,.,.,030303.,.,.,.,",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,.,.,.,.,030303.,.,.,.,.,030303",
          ],
      },
      brickTopRight: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,030303",
              "03030303.,03030303030303.,030303",
              "03030303.,03030303030303.,030303",
              "03030303.,03030303030303.,030303",
              ".,.,.,.,.,.,.,.,.,030303.,.,.,.,",
              ".,03030303030303.,030303.,030303",
              ".,03030303030303.,030303.,030303",
              ".,03030303030303.,030303.,030303",
              ".,.,.,.,.,030303.,.,.,.,.,030303",
              "03030303.,030303.,030303.,030303",
              "03030303.,030303.,030303.,030303",
              "03030303.,.,.,.,.,030303.,.,.,.,",
          ],
      },
      brickBottomLeft: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,030303.,030303.,030303",
              ".,030303.,.,.,.,.,030303.,.,.,.,",
              ".,030303.,030303,.03030303030303",
              ".,030303.,030303,.03030303030303",
              ".,030303.,030303.,03030303030303",
              ".,.,.,.,.,030303.,.,.,.,.,.,.,.,",
              ".,030303.,03030303030303.3030303",
              ".,030303.,03030303030303.3030303",
              ".,030303.,03030303030303.3030303",
              ".,030303.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
              ".,03030303030303.,03030303030303",
          ],
      },
      brickBottomRight: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,030303.,030303.,030303.,030303",
              "03030303.,030303.,030303.,030303",
              "03030303.,030303.,030303.,030303",
              "03030303.,030303.,030303.,030303",
              ".,.,.,.,.,030303.,.,.,.,.,030303",
              ".,03030303030303,.030303.,030303",
              ".,03030303030303,.030303.,030303",
              ".,03030303030303,.030303.,030303",
              ".,.,.,.,.,.,.,.,.,030303.,.,.,.,",
              "0303030303030303.,030303.,030303",
              "0303030303030303.,030303.,030303",
              "0303030303030303.,030303.,030303",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,030303",
              "03030303.,03030303030303.,030303",
              "03030303.,03030303030303.,030303",
              "03030303.,03030303030303.,030303",
          ],
      },
  },

  "24x24": {
      empty: {
          image: null,
          defaultBounds: null,
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ]
      },
      die00: {
          image: null,
          defaultBounds: null,
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ]
      },
      die03: {
          image: null,
          defaultBounds: null,
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505000005050505050505050500.,",
              ".,00050505050505050500030300050505050505050500.,",
              ".,00050505050505050003030303000505050505050500.,",
              ".,00050505050505050003030303000505050505050500.,",
              ".,00050505050505050500030300050505050505050500.,",
              ".,00050505050505050505000005050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ]
      },
      die02: {
          image: null,
          defaultBounds: null,
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050500000505050500.,",
              ".,00050505050505050505050505050003030005050500.,",
              ".,00050505050505050505050505000303030300050500.,",
              ".,00050505050505050505050505000303030300050500.,",
              ".,00050505050505050505050505050003030005050500.,",
              ".,00050505050505050505050505050500000505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505000005050505050505050500.,",
              ".,00050505050000050505050505050505050505050500.,",
              ".,00050505000303000505050505050505050505050500.,",
              ".,00050500030303030005050505050505050505050500.,",
              ".,00050500030303030005050505050505050505050500.,",
              ".,00050505000303000505050505050505050505050500.,",
              ".,00050505050000050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ]
      },
      die03: {
          image: null,
          defaultBounds: null,
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050500000505050500.,",
              ".,00050505050505050505050505050003030005050500.,",
              ".,00050505050505050505050505000303030300050500.,",
              ".,00050505050505050505050505000303030300050500.,",
              ".,00050505050505050505050505050003030005050500.,",
              ".,00050505050505050505050505050500000505050500.,",
              ".,00050505050505050505000005050505050505050500.,",
              ".,00050505050505050500030300050505050505050500.,",
              ".,00050505050505050003030303000505050505050500.,",
              ".,00050505050505050003030303000505050505050500.,",
              ".,00050505050505050500030300050505050505050500.,",
              ".,00050505050505050505000005050505050505050500.,",
              ".,00050505050000050505050505050505050505050500.,",
              ".,00050505000303000505050505050505050505050500.,",
              ".,00050500030303030005050505050505050505050500.,",
              ".,00050500030303030005050505050505050505050500.,",
              ".,00050505000303000505050505050505050505050500.,",
              ".,00050505050000050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ]
      },
      die04: {
          image: null,
          defaultBounds: null,
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ]
      },
      die05: {
          image: null,
          defaultBounds: null,
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505050505050505000005050505050505050500.,",
              ".,00050505050505050500030300050505050505050500.,",
              ".,00050505050505050003030303000505050505050500.,",
              ".,00050505050505050003030303000505050505050500.,",
              ".,00050505050505050500030300050505050505050500.,",
              ".,00050505050505050505000005050505050505050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ]
      },
      die06: {
          image: null,
          defaultBounds: null,
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050500030303030005050505000303030300050500.,",
              ".,00050505000303000505050505050003030005050500.,",
              ".,00050505050000050505050505050500000505050500.,",
              ".,00050505050505050505050505050505050505050500.,",
              ".,.,0000000000000000000000000000000000000000.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ]
      },
  },

  "32x32": {
      empty: {
          image: null, // Built when first instance is created
          defaultBounds: null, // Built when queried
          pixelData: [
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
              ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,",
          ],
      },
  },

  palettes: [
      // For now, all palettes are the same: primary colors and full and half brightness.
      // Default palette
      // 0 = black
      // 1 = white
      // 2 = dk gray
      // 3 = lt gray
      // 4 = red
      // 5 = green
      // 6 = blue
      // 7 = yellow
      // 8 = cyan
      // 9 = purple
      // A = dk red
      // B = dk green
      // C = dk blue
      // D = orange
      // E = dk cyan
      // F = brown (dk orange)
      ["rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(64, 64, 64, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(64, 64, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(128, 0, 128, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 255, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(96, 48, 0, 1)"
      ],

      // Flesh Tones
      ["rgba(0, 0, 0, 0)", "rgba(192, 178, 128, 1)", "rgba(86, 69, 64, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      // Translucent -- TODO: clean up float values for r, g, and b elements.
      ["rgba(0, 0, 0, 0.25)", "rgba(255, 255, 255, 0.25)", "rgba(0, 0, 255, 0, 0.25)", "rgba(64, 64, 64, 0.25)",
          "rgba(255, 0, 0, 0.25)", "rgba(0, 255, 0, 0.25)", "rgba(0.25, 0.25, 255, 0.25)", "rgba(255, 255, 0, 0.25)",
          "rgba(0, 255, 255, 0.25)", "rgba(0.5, 0, 0.5, 0.25)", "rgba(0.5, 0, 0, 0.25)", "rgba(0, 0.5, 0, 0.25)",
          "rgba(0, 0, 255, 0.25)", "rgba(0.5, 0.5, 0, 0.25)", "rgba(0, 0.5, 0.5, 0.25)", "rgba(96, 48, 0, 0.25)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],

      ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)", "rgba(255, 255, 255, 1)", "rgba(128, 128, 128, 1)",
          "rgba(255, 0, 0, 1)", "rgba(0, 255, 0, 1)", "rgba(0, 0, 255, 1)", "rgba(255, 255, 0, 1)",
          "rgba(0, 255, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(128, 0, 0, 1)", "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)", "rgba(128, 128, 0, 1)", "rgba(0, 128, 128, 1)", "rgba(128, 0, 128, 1)"
      ],
  ]
};

//////////////////////////////////////////////////////////////////////////////////////////////
// oooooooooooo  oooooooooooo   .oooooo.    oooo                         oooo                 
// `888'     `8 d'""""""d888'  d8P'  `Y8b   `888                         `888                 
//  888               .888P   888            888  oooo    ooo oo.ooooo.   888 .oo.    .oooo.o 
//  888oooo8         d888'    888            888   `88.  .8'   888' `88b  888P"Y88b  d88(  "8 
//  888    "       .888P      888     ooooo  888    `88..8'    888   888  888   888  `"Y88b.  
//  888       o   d888'    .P `88.    .88'   888     `888'     888   888  888   888  o.  )88b 
// o888ooooood8 .8888888888P   `Y8bood8P'   o888o     .8'      888bod8P' o888o o888o 8""888P' 
//                                                .o..P'       888                            
//                                                `Y8P'       o888o                           
//////////////////////////////////////////////////////////////////////////////////////////////

/**
*  Allows programmers to define views using preset shapes called "glyphs". These are
*  meant to be an approximation of Commodore 64 keyboard graphics.
*
*  Glyphs render into a bitmap using two structures: shape data, and color 
*
*  ShapeData consists of a 1D array of strings. Each string consists of n
*  elements, each 2 chars. The first char represents the glyph as a direct
*  lookup into the glyphMap (for example: '|'). The second char must be a
*  number from 0 to 3 representing the number of 90 degree rotations to
*  apply to the glyph. All rotations take place at the center of the cell.
*
*  ColorData consists of a 1D array of paired strings. Each string consists
*  of n elements, each 2 chars. The first string in the pair represents
*  background colors, with the first char in each cell referencing a color
*  palette, and the next character representing the color within that
*  palette. The second string represents foreground colors, using the same
*  2 character encoding scheme to look up colors from predefined palettes.
*  In all cases, color value 0 represents "no color" -- or full alpha.
*/
jb.EZglyphs = {
  // Class Definition ///////////////////////////////////////////////////////
  EMPTY_GLYPH: '.',

  // For all glyphMap elements:
  // gfx = graphics context into which to draw
  // cs = cellSize,
  // hcs = half cellSize
  GLYPH_MAP: {
      '.': null, // EMPTY_GLYPH
      '|': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.moveTo(0, -hcs);
              gfx.lineTo(0, hcs);
              gfx.stroke();
          }
      },
      '-': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.moveTo(-hcs, 0);
              gfx.lineTo(hcs, 0);
              gfx.stroke();
          }
      },
      '_': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.moveTo(-hcs, hcs);
              gfx.lineTo(hcs, hcs);
              gfx.stroke();
          }
      },
      '+': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.moveTo(0, -hcs);
              gfx.lineTo(0, hcs);
              gfx.moveTo(-hcs, 0);
              gfx.lineTo(hcs, 0);
              gfx.stroke();
          }
      },
      'r': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.moveTo(0, hcs);
              gfx.lineTo(0, 0);
              gfx.lineTo(hcs, 0);
              gfx.stroke();
          }
      },
      '/': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.moveTo(hcs, -hcs);
              gfx.lineTo(-hcs, hcs);
              gfx.stroke();
          }
      },
      '?': {
          draw: function(gfx, cs, hcs) { // Can't use backslash because it requres two characters
              gfx.beginPath();
              gfx.moveTo(-hcs, -hcs);
              gfx.lineTo(hcs, hcs);
              gfx.stroke();
          }
      },
      'x': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.moveTo(hcs, -hcs);
              gfx.lineTo(-hcs, hcs);
              gfx.stroke();
              gfx.moveTo(-hcs, -hcs);
              gfx.lineTo(hcs, hcs);
              gfx.stroke();
          }
      },
      'l': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.moveTo(-hcs, -hcs);
              gfx.lineTo(-hcs, hcs);
              gfx.stroke();
          }
      },
      '[': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.moveTo(hcs, hcs);
              gfx.lineTo(0, hcs),
                  gfx.lineTo(0, -hcs);
              gfx.lineTo(hcs, -hcs);
              gfx.stroke();
          }
      },
      'v': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.moveTo(-hcs, 0);
              gfx.lineTo(0, hcs);
              gfx.lineTo(hcs, 0);
              gfx.stroke();
          }
      },
      'L': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.moveTo(-hcs, -hcs);
              gfx.lineTo(-hcs, hcs);
              gfx.lineTo(hcs, hcs);
              gfx.stroke();
          }
      },
      'O': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.arc(0, 0, hcs, 0, 2 * Math.PI, true);
              gfx.stroke();
          }
      },
      ')': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.arc(0, 0, hcs, -Math.PI / 2, Math.PI / 2, false);
              gfx.stroke();
          }
      },
      '(': {
          draw: function(gfx, cs, hcs) {
              gfx.beginPath();
              gfx.arc(hcs, hcs, hcs, Math.PI / 2, 3 * Math.PI / 2, false);
              gfx.stroke();
          }
      }
  },

  DEFAULT_PALETTE: [
      "#FF00FF", // Should never see this color, as '0' means "full alpha"
      "#000000",
      "#888888",
      "#FFFFFF",
      "#FF0000",
      "#00FF00",
      "#0000FF",
      "#FFFF00",
      "#FF8800",
      "#880088",
      "#00FFFF",
  ],

  MONOCHROME_PALETTE: [
      "#FF00FF", // Should never see this color, as '0' means "full alpha"
      "#000000",
      "#222222",
      "#444444",
      "#666666",
      "#888888",
      "#AAAAAA",
      "#CCCCCC",
      "#EEEEEE",
      "#FFFFFF"
  ],

  TRANSPARENT: "transparent",

  // Instance Definition ////////////////////////////////////////////////////
  ROW_SIZE: 1,
  COL_SIZE: 2,
  cellSize: 16,
  shapeData: null,
  colorData: null,
  backFill: null,
  lineWidth: 1,

  generate: function(cellSize, shapeData, colorData, lineWidth, backFill, palettes) {
      this.setCellSize(cellSize);
      this.setShapeData(shapeData);
      this.setColorData(colorData);
      this.setLineWidth(lineWidth);
      this.setBackFill(backFill);
      this.setPalettes(palettes || this.DEFAULT_PALLETE);

      return this.generateImage();
  },

  generateImage: function() {
      var w, h, newCanvas, newImage;

      jb.assert(this.shapeData &&
          this.shapeData.length > 0 &&
          this.shapeData[0] &&
          this.shapeData[0].length >= this.COL_SIZE,
          "Invalid EZglyph shape data!");

      w = this.shapeData[0].length / this.COL_SIZE * this.cellSize;
      h = this.shapeData.length / this.ROW_SIZE * this.cellSize;
      newCanvas = jb.createCanvas(w, h);

      this.draw(newCanvas.context);

      return newCanvas.canvas;
  },

  setCellSize: function(newSize) {
      this.cellSize = Math.max(newSize, 1);
  },

  setShapeData: function(newData) {
      this.shapeData = newData ? newData : null;
  },

  setColorData: function(newData) {
      this.colorData = newData ? newData : null;
  },

  setLineWidth: function(newWidth) {
      this.lineWidth = newWidth ? newWidth : 1;
  },

  setBackFill: function(newFill) {
      this.backFill = newFill ? newFill : jb.EZglyphs.TRANSPARENT;
  },

  setPalettes: function(newPalettes) {
      if (newPalettes) {
          this.palettes = newPalettes;
      } else {
          this.palettes = [];
          this.palettes.push(jb.EZglyphs.DEFAULT_PALETTE);
          this.palettes.push(jb.EZglyphs.MONOCHROME_PALETTE);
      }
  },

  draw: function(gfx, x0, y0) {
      var x, y, glyph, rot, bc, fc, pal, bBackColors, iRow, iCol, color;

      x0 = x0 || 0;
      y0 = y0 || 0;

      if (gfx && this.shapeData && this.colorData) {
          jb.assert(this.shapeData.length === this.colorData.foreground.length &&
              this.shapeData.length > 0 &&
              this.shapeData[0].length === this.colorData.foreground[0].length,
              "Invalid shape or foreground color data!");

          bBackColors = Boolean(this.colorData.background) && this.colorData.background.length > 0;

          if (bBackColors) {
              jb.assert(this.shapeData.length === this.colorData.background.length &&
                  this.shapeData.length > 0 &&
                  this.shapeData[0].length === this.colorData.background[0].length,
                  "Invalid shape or background color data!");
          }

          gfx.save();

          // Empty the space into which we'll draw the shape.
          if (this.backFill === jb.EZglyphs.TRANSPARENT) {
              gfx.clearRect(0,
                  0,
                  this.shapeData[0].length / this.COL_SIZE * this.cellSize,
                  this.shapeData.length / this.ROW_SIZE * this.cellSize);
          } else {
              gfx.fillStyle = this.backFill;
              gfx.fillRect(0,
                  0,
                  this.shapeData[0].length / this.COL_SIZE * this.cellSize,
                  this.shapeData.length / this.ROW_SIZE * this.cellSize);
          }

          gfx.lineWidth = this.lineWidth;

          for (iRow = 0; iRow < this.shapeData.length; iRow += this.ROW_SIZE) {
              gfx.save();
              y = y0 + this.cellSize * iRow / this.ROW_SIZE;

              for (iCol = 0; iCol < this.shapeData[0].length; iCol += this.COL_SIZE) {
                  x = x0 + this.cellSize * iCol / this.COL_SIZE;
                  glyph = jb.EZglyphs.GLYPH_MAP[this.shapeData[iRow].charAt(iCol)];
                  rot = parseInt(this.shapeData[iRow].charAt(iCol + 1));

                  if (glyph) {
                      gfx.translate(x, y);

                      // Draw the cell background, if any.
                      if (bBackColors) {
                          pal = parseInt(this.colorData.background[iRow].charAt(iCol));
                          bc = parseInt(this.colorData.background[iRow].charAt(iCol + 1));

                          if (bc > 0 && pal < this.palettes.length && bc < this.palettes[pal].length) {
                              gfx.fillStyle = this.palettes[pal][bc];
                              gfx.fillRect(0, 0, this.cellSize, this.cellSize);
                          }
                      }

                      // Draw the cell foreground.
                      if (rot !== NaN && glyph) {
                          pal = this.colorData.foreground[iRow].charAt(iCol);
                          fc = this.colorData.foreground[iRow].charAt(iCol + 1);

                          if (fc > 0 && pal < this.palettes.length && fc < this.palettes[pal].length) {
                              color = this.palettes[pal][fc];
                              gfx.strokeStyle = color;
                              gfx.translate(this.cellSize / 2, this.cellSize / 2);

                              if (rot) {
                                  gfx.rotate(rot * 2 * Math.PI / 4);
                              }

                              glyph.draw(gfx, this.cellSize, this.cellSize / 2);

                              gfx.setTransform(1, 0, 0, 1, 0, 0);
                          }
                      }
                  }
              }

              gfx.restore();
          }

          gfx.restore();
      }
  }
};

///////////////////////////////////////////////////////////////////////////////
//  .oooooo.o   .oooooo.   ooooo     ooo ooooo      ooo oooooooooo.   
// d8P'    `Y8  d8P'  `Y8b  `888'     `8' `888b.     `8' `888'   `Y8b  
// Y88bo.      888      888  888       8   8 `88b.    8   888      888 
//  `"Y8888o.  888      888  888       8   8   `88b.  8   888      888 
//      `"Y88b 888      888  888       8   8     `88b.8   888      888 
// oo     .d8P `88b    d88'  `88.    .8'   8       `888   888     d88' 
// 8""88888P'   `Y8bood8P'     `YbodP'    o8o        `8  o888bood8P'   
// SOUND //////////////////////////////////////////////////////////////////////
/**
 * Advanced usage:
 * Create sound groups and add sounds to them.
 * When a new sound belonging to a sound group starts playing,
 * it will stop all other sounds in the group.
 * Also, sound groups are given a priority. When a new sound
 * plays, it will force all sounds in lower-priorty groups to
 * duck.
 * 
 * Usage:
 *  jb.sound.createGroup("themes", 10);
 *  jb.sound.setGroup(this.sounds["level_start"], "themes");
 *  jb.sound.setGroup(this.sounds["victory"], "themes");
 *  jb.sound.play(this.sounds["victory"]);
 *  jb.sound.play(this.sounds["level_start"]);
 * 
 * The 'victory' sound will stop playing immediately, allowing "level_start"
 * to play without sounding jumbled.
 */
jb.sound = {
  DEFAULT_FREQ: 440, // Hz
  DEFAULT_VOL: 1.0,
  DEFAULT_DUR: 0.25, // sec
  CHANNELS: {
      MONO: 1,
      STEREO: 2
  },
  WAVES_PER_NOISE: 17,
  FORMAT: {
      MP3: {
          ext: 'mp3',
          mime: 'audio/mpeg'
      },
      OGG: {
          ext: 'ogg',
          mime: 'audio/ogg; codecs=vorbis'
      }
  },
  DEFAULT_CHANNELS: 2,
  DEFAULT_DELAY: 0.1,
  STOP_ALL_CHANNELS: -1,
  INVALID_CHANNEL: -99,
  VOL_DECAY_RATE: Math.log(8) / 100.0,
  LOOPING_DUCK_TIME: 10000,

  isEnabled: false,
  isAvailable: window.Audio,
  preferredFormat: null,
  sounds: {},
  groups: {},
  groupList: [],
  groupIndex: -1,
  duckVolume: 0.5,

  setDuckVolume: function(newDuckVolume) {
    jb.sound.duckVolume = newDuckVolume;
  },

  update: function() {
    var decay = Math.exp(-jb.time.deltaTimeMS * jb.sound.VOL_DECAY_RATE);

    jb.sound.updateDucking();

    for (var key in jb.sound.sounds) {
      var sound = jb.sound.sounds[key];

      for (var i=0; i<sound.channels.length; ++i) {
        sound.info[i].killVol = (sound.info[i].wantKillVol + (sound.info[i].killVol - sound.info[i].wantKillVol) * decay);
        sound.info[i].duckVol = (sound.info[i].wantDuckVol + (sound.info[i].duckVol - sound.info[i].wantDuckVol) * decay);
        sound.info[i].curVol = (sound.info[i].volume + (sound.info[i].curVol - sound.info[i].volume) * decay);

        var totalVolume = sound.info[i].curVol * Math.min(sound.info[i].duckVol * sound.info[i].killVol) * jb.sound.masterVolume;
        totalVolume = jb.sound.clampVolume(totalVolume);
        sound.channels[i].volume = totalVolume;

        if (sound.info[i].killVol < jb.EPSILON && sound.info[i].wantKillVol < jb.EPSILON) {
          jb.sound.stopChannel(sound, i);
        }
      }
    }
  },

  updateDucking: function() {
    var duckIndex = -1;
    for (var i=0; i<jb.sound.groupList.length; ++i) {
      var group = jb.sound.groupList[i];
      if (group.duckTimer > jb.EPSILON || group.duckTimer <= -jb.LOOPING_DUCK_TIME) {
        if (group.duckTimer >= 0) {
          group.duckTimer -= jb.time.deltaTime;
          group.duckTimer = Math.max(0, group.duckTimer);
        }

        if (duckIndex === -1) {
          duckIndex = i;

          // Duck every sound below this one.
          for (var iGroup=i+1; iGroup<jb.sound.groupList.length; ++iGroup) {
            var duckGroup = jb.sound.groupList[iGroup];
            for (var iSound=0; iSound<duckGroup.sounds.length; ++iSound) {
              duckGroup.sounds[iSound].wantDuckVol = jb.sound.duckVolume;
            }
          }
        }
      }
      else if (duckIndex === -1) {
        // Un-duck all the sounds up to the first group that
        // wants ducking.
        group.duckTimer = 0;
        for (var iSound=0; iSound<group.sounds.length; ++iSound) {
          group.sounds[iSound].wantDuckVol = 1.0;
        }
      }
      else {
        group.duckTimer = 0;
      }
    }
  },

  duckSounds: function(sound) {
      if (sound && sound.groupName && jb.sound.groups.hasOwnProperty(sound.groupName)) {
        var group = jb.sound.groups[sound.groupName];
        if (sound.channels[0].loop) {
          group.duckTimer = -jb.LOOPING_DUCK_TIME;
        }
        else {
          group.duckTimer = sound.channels[0].duration;
        }
      }
  },

  // Only one sound from each group is allowed to play.
  // When a group plays, if forces all groups beneath it
  // (in priority) to 'duck'.
  createGroup: function(name, priority) {
    jb.sound.groupIndex += 1;

    name = name || "sound_group_" + jb.sound.groupIndex;
    priority = priority || 1

    jb.sound.addGroup(name, {sounds: [], priority: priority, duckTimer: 0});
  },

  addGroup: function(name, group) {
    jb.sound.groups[name] = group;
    jb.sound.groupList.push(group);

    for (var iOuter=0; iOuter<jb.sound.groupList.length - 1; ++iOuter) {
      var bestPriority = jb.sound.groupList[iOuter];
      var bestIndex = iOuter;

      for (var iInner=iOuter+1; iInner<jb.sound.groupList.length; ++iInner) {
        var testPriority = jb.sound.groupList[iInner].priority;
        if (bestPriority < testPriority) {
          bestPriority = testPriority;
          bestIndex = iInner;
        }
      }

      if (bestIndex !== iOuter) {
        var temp = jb.sound.groupList[bestIndex];
        jb.sound.groupList[bestIndex] = jb.sound.groupList[iOuter];
        jb.sound.groupList[iOuter] = temp;
      }
    }
  },

  masterVolume: 1.0,
  audioContext: null,
  noiseFactor: 0.33,
  channels: 1,
  dummySound: {
      audioNode: null,
      play: function() {},
      stop: function() {}
  },

  init: function() {
      var capTester = new Audio(),
          iFormat = 0;

      // Audio resource initialization:
      for (iFormat in jb.sound.FORMAT) {
          if (capTester.canPlayType(jb.sound.FORMAT[iFormat].mime) === "probably") {
              jb.sound.preferredFormat = jb.sound.FORMAT[iFormat];
              break;
          }
      }

      if (!this.preferredFormat) {
          for (iFormat in jb.sound.FORMAT) {
              if (capTester.canPlayType(jb.sound.FORMAT[iFormat].mime) === "maybe") {
                  jb.sound.preferredFormat = jb.sound.FORMAT[iFormat];
                  break;
              }
          }
      }

      if (jb.sound.preferredFormat) {
          jb.sound.isAvailable = true;
          jb.sound.isEnabled = true;
      }

      // Procedural audio initialization:
      try {
          window.AudioContext = window.AudioContext || window.webkitAudioContext;
          this.audioContext = new AudioContext();
      } catch (e) {
          alert('Web Audio API is not supported in this browser');
      }
  },

  // Sound Resources ----------------------------------------------
  activate: function() {
      jb.sound.isEnabled = jb.sound.isAvailable;
  },

  deactivate: function() {
      jb.sound.stopAll();
      jb.sound.isEnabled = false;
  },

  getFreeChannelIndex: function(sound, now) {
      var i = 0;
      var iChannel = jb.sound.INVALID_CHANNEL;
      var mostDelay = 0;
      var testDelay = 0;

      if (sound && sound.channels.length && sound.info.length && sound.lastPlayTime.length) {
          for (var i = 0; i < sound.channels.length; ++i) {
              testDelay = (now - sound.lastPlayTime[i]) * 0.003;
              if (testDelay > mostDelay && testDelay > sound.minDelay) {
                  mostDelay = testDelay;
                  iChannel = i;
              }
          }
      }

      return iChannel;
  },

  setVolume: function(sound, volume) {
      var totalVolume = typeof(volume) === 'undefined' ? 1 : volume;
      var channelIndex = jb.sound.channels.indexOf(sound);
      if (channelIndex >= 0) {
        jb.sound.info[channelIndex].volume = totalVolume;
      }

      totalVolume = jb.sound.clampVolume(totalVolume * jb.sound.getMasterVolume());

      var iChannel = 0,
          iStart = typeof(channelIndex) === 'undefined' || channelIndex === jb.sound.INVALID_CHANNEL ? 0 : channelIndex,
          iEnd = typeof(channelIndex) === 'undefined' || channelIndex === jb.sound.INVALID_CHANNEL ? sound.channels.length - 1 : channelIndex;

      for (iChannel = iStart; iChannel <= iEnd; ++iChannel) {
          sound.channels[iChannel].pause();
          sound.channels[iChannel].volume = totalVolume;
          sound.channels[iChannel].play();
      }
  },

  play: function(sound, volume) {
      var totalVolume = typeof(volume) === 'undefined' ? 1 : volume,
          playedIndex = jb.sound.INVALID_CHANNEL,
          now = Date.now();

      totalVolume = jb.sound.clampVolume(totalVolume * jb.sound.getMasterVolume());

      if (sound) {
          jb.sound.stopSoundsInGroup(sound.groupName);

          playedIndex = jb.sound.getFreeChannelIndex(sound, now);

          try {
              if (playedIndex !== jb.sound.INVALID_CHANNEL) {
                  sound.iChannel = playedIndex;
                  sound.lastPlayTime[playedIndex] = now;
                  sound.channels[playedIndex].pause();
                  sound.channels[playedIndex].loop = false;
                  sound.channels[playedIndex].volume = totalVolume;
                  sound.channels[playedIndex].currentTime = 0;
                  sound.info[playedIndex].playing = true;
                  sound.info[playedIndex].volume = totalVolume;
                  sound.info[playedIndex].curVol = totalVolume;
                  sound.channels[playedIndex].play();

                  jb.sound.duckSounds(sound);
              }
          } catch (err) {
              // Error message?
          }
      }

      return playedIndex;
  },

  loop: function(sound, volume) {
      var now = Date.now(),
          totalVolume = typeof(volume) === 'undefined' ? 1 : volume,
          playedIndex = jb.sound.INVALID_CHANNEL;

      totalVolume = jb.sound.clampVolume(totalVolume * jb.sound.getMasterVolume());

      if (sound) {
        jb.sound.stopSoundsInGroup(sound.groupName);

        playedIndex = jb.sound.getFreeChannelIndex(sound, now);

          try {
              if (playedIndex !== jb.sound.INVALID_CHANNEL) {
                  sound.iChannel = playedIndex;
                  sound.lastPlayTime[playedIndex] = now;
                  sound.channels[playedIndex].pause();
                  sound.channels[playedIndex].loop = true;
                  sound.channels[playedIndex].volume = totalVolume;
                  sound.channels[playedIndex].currentTime = 0;
                  sound.info[playedIndex].playing = true;
                  sound.info[playedIndex].volume = totalVolume;
                  sound.info[playedIndex].curVol = totalVolume;
                  sound.channels[playedIndex].play();

                  jb.sound.duckSounds(sound);
              }
          } catch (err) {
              // Error message?
          }
      }

      return playedIndex;
  },

  pause: function(sound, channelIndex) {
      var iChannel = 0,
          iStart = typeof(channelIndex) === 'undefined' || channelIndex === jb.sound.INVALID_CHANNEL ? 0 : channelIndex,
          iEnd = typeof(channelIndex) === 'undefined' || channelIndex === jb.sound.INVALID_CHANNEL ? sound.channels.length - 1 : channelIndex;

      for (iChannel = iStart; iChannel <= iEnd; ++iChannel) {
          jb.sound.endDucking(sound, iChannel);
          sound.channels[iChannel].pause();
          sound.info[iChannel].playing = false;
      }
  },

  resume: function(sound, channelIndex) {
      var iChannel = 0,
          iStart = typeof(channelIndex) === 'undefined' || channelIndex === jb.sound.INVALID_CHANNEL ? 0 : channelIndex,
          iEnd = typeof(channelIndex) === 'undefined' || channelIndex === jb.sound.INVALID_CHANNEL ? sound.channels.length - 1 : channelIndex;

      jb.sound.duckSounds(sound);

      for (iChannel = iStart; iChannel <= iEnd; ++iChannel) {
          sound.channels[iChannel].play();
          sound.info[iChannel].playing = true;
      }
  },

  stop: function(sound, channelIndex) {
      var iChannel = 0,
          iStart = typeof(channelIndex) === 'undefined' || channelIndex === jb.sound.INVALID_CHANNEL ? 0 : channelIndex,
          iEnd = typeof(channelIndex) === 'undefined' || channelIndex === jb.sound.INVALID_CHANNEL ? sound.channels.length - 1 : channelIndex;

      channelIndex = channelIndex || jb.sound.STOP_ALL_CHANNELS;

      if (channelIndex === jb.sound.STOP_ALL_CHANNELS) {
          iStart = 0;
          iEnd = sound.channels.length - 1;
      }

      try {
          for (iChannel = iStart; iChannel <= iEnd; ++iChannel) {
              jb.sound.stopChannel(sound, iChannel);
          }
      } catch (err) {
          // Error message?
      }
  },

  stopAll: function() {
      var key;

      for (key in jb.sound.sounds) {
          jb.sound.stop(jb.sound.sounds[key], jb.sound.STOP_ALL_CHANNELS);
      }
  },

  stopChannel: function(sound, iChannel) {
    jb.sound.endDucking(sound, iChannel);

    sound.channels[iChannel].pause();
    sound.channels[iChannel].loop = false;
    sound.channels[iChannel].currentTime = 0;
    sound.info[iChannel].playing = false;
  },

  endDucking: function(sound, iChannel) {
    if (sound.info[iChannel].playing && jb.sound.groups.hasOwnProperty(sound.groupName)) {
      // If this was the active sound in the group, make sure to undo ducking.
      var group = jb.sound.groups[sound.groupName];
      group.duckTimer = 0;
    }
  },

  setGroup: function(sound, groupName) {
    jb.assert(jb.sound.groups.hasOwnProperty(groupName), "No such sound group!");

    if (jb.sound.groups[groupName].sounds.indexOf(sound) < 0) {
      if (sound && sound.info) {
        for (var i=0; i<sound.info.length; ++i) {
          sound.info[i].group = groupName;
        }
      }

      if (jb.sound.groups[groupName].sounds.indexOf(sound) < 0) {
        jb.sound.groups[groupName].sounds.push(sound);
      }
    }
  },

  stopSoundsInGroup: function(name) {
    if (jb.sound.groups.hasOwnProperty(name)) {
      var group = jb.sound.groups[name];
      for (var i=0; i<group.sounds.length; ++i) {
        group.sounds[i].wantKillVol = 0;
      }
    }
  },

  setMasterVolume: function(newMasterVolume) {
      jb.sound.masterVolume = jb.sound.clampVolume(newMasterVolume);
  },

  getMasterVolume: function() {
      return jb.sound.masterVolume;
  },

  clampVolume: function(volume) {
      return Math.min(1, Math.max(0, volume));
  },

  load: function(resourceName, onLoadedCallback, onErrorCallback, nChannels, replayDelay) {
      var numChannels = nChannels || jb.sound.DEFAULT_CHANNELS,
          minReplayDelay = replayDelay || jb.sound.DEFAULT_DELAY,
          path = resourceName,
          extension = path.substring(path.lastIndexOf(".")),
          nNewChannels = 0,
          i = 0,
          newChannel = null,
          sentinel = null;

      if (jb.sound.preferredFormat) {
          if (extension) {
              path = path.replace(extension, "");
          }

          path = path + "." + jb.sound.preferredFormat.ext;

          if (!jb.sound.sounds[resourceName] ||
              jb.sound.sounds[resourceName].length < nChannels) {
              if (!jb.sound.sounds[resourceName]) {
                  jb.sound.sounds[resourceName] = {
                      channels: [],
                      info: [],
                      lastPlayTime: [],
                      minDelay: minReplayDelay,
                  };
              }

              nNewChannels = numChannels - jb.sound.sounds[resourceName].channels.length;
              for (i = 0; i < nNewChannels; ++i) {
                  newChannel = new Audio(path);
                  sentinel = new function() {
                      this.bFirstTime = true
                  };

                  newChannel.addEventListener('canplaythrough', function callback() {
                      // HACKy "fix" for Chrome's 'canplaythrough' bug.
                      if (sentinel.bFirstTime) {
                          if (onLoadedCallback) {
                              onLoadedCallback(jb.sound.sounds[resourceName], resourceName);
                          }
                          sentinel.bFirstTime = false;
                      }
                  }, false);

                  if (onErrorCallback) {
                      newChannel.addEventListener('onerror', function callback() {
                          onErrorCallback(resourceName);
                      }, false);
                  }

                  newChannel.preload = "auto";
                  newChannel.load();
                  jb.sound.sounds[resourceName].channels.push(newChannel);
                  jb.sound.sounds[resourceName].info.push({volume: 1, group: null, playing: false, wantKillVol: 1, killVol: 1, wantDuckVol: 1, duckVol: 1, curVol: 1});
                  jb.sound.sounds[resourceName].lastPlayTime.push(0);
              }
          }
      } else if (onLoadedCallback) {
          onLoadedCallback(resourceName, "Error: no preferred format");
      }

      return jb.sound.sounds[resourceName];
  },

  // Procedural Sound ---------------------------------------------
  makeSound: function(waveform, duration, volume, startFreq, endFreq) {
      volume = volume || this.DEFAULT_VOL;
      duration = duration || this.DEFAULT_DUR;
      startFreq = startFreq || this.DEFAULT_FREQ;
      endFreq = endFreq || startFreq;

      return this.audioContext ? this.newSoundFromBuffer(this.getBuffer(waveform, startFreq, endFreq, volume, duration), duration) : this.dummySound;
  },

  waveFns: {
      sine: function(f, t, s) {
          var p = 2.0 * Math.PI * t * f;

          return Math.sin(p);
      },

      saw: function(f, t, s) {
          var p = t * f;
          p = p - Math.floor(p);

          return 2.0 * (p - 0.5);
      },

      square: function(f, t, s) {
          var p = t * f;
          p = p - Math.floor(p);

          return p < 0.5 ? 1.0 : -1.0;
      },

      noisySine: function(f, t, s) {
          return jb.sound.waveFns.sine(f, Math.abs(t + (Math.random() - 0.5) * jb.sound.noiseFactor / f), s);
      },

      noisySaw: function(f, t, s) {
          return jb.sound.waveFns.saw(f, Math.abs(t + (Math.random() - 0.5) * jb.sound.noiseFactor / f), s);
      },

      noisySquare: function(f, t, s) {
          return jb.sound.waveFns.square(f, Math.abs(t + (Math.random() - 0.5) * jb.sound.noiseFactor / f), s);
      },

      noise: function(f, t, s) {
          return 2.0 * (0.5 - Math.random());
      },
  },

  getBuffer: function(waveform, startFreq, endFreq, vol, dur) {
      var nSamples = Math.round(dur * this.audioContext.sampleRate),
          buffer = this.audioContext.createBuffer(this.channels, nSamples, this.audioContext.sampleRate),
          t = 0,
          freq = 0,
          waveFn = this.waveFns[waveform] || this.waveFns["sine"],
          iChannel = 0,
          iSample = 0,
          bPinkNoise = waveform.toUpperCase() === "PINKNOISE",
          iPhase = 0,
          iWave = 0,
          maxAmp = 0,
          numWaves = 0,
          iSamplesPerWave = 0,
          samples = null;

      for (iChannel = 0; iChannel < this.channels; ++iChannel) {
          samples = buffer.getChannelData(iChannel);

          if (bPinkNoise) {
              // Generate noise in the given frequency band by piecing together
              // square waves of random frequencies from within the band.
              numWaves = Math.min(Math.floor((endFreq - startFreq) * 0.33), jb.sound.WAVES_PER_NOISE);

              for (iWave = 0; iWave <= numWaves; ++iWave) {
                  freq = Math.round(startFreq + (endFreq - startFreq) * iWave / numWaves);
                  iSamplesPerWave = Math.floor(this.audioContext.sampleRate / freq);
                  iPhase = Math.floor(Math.random() * iSamplesPerWave);

                  freq = Math.sqrt(freq);
                  for (iSample = 0; iSample < nSamples; ++iSample) {
                      if ((iSample + iPhase) % iSamplesPerWave < iSamplesPerWave / 2) {
                          samples[iSample] += 1.0 / freq;
                      } else {
                          samples[iSample] += -1.0 / freq;
                      }

                      if (Math.abs(samples[iSample]) > maxAmp) {
                          maxAmp = Math.abs(samples[iSample]);
                      }
                  }
              }
          } else {
              for (iSample = 0; iSample < nSamples; ++iSample) {
                  t = iSample / this.audioContext.sampleRate;
                  freq = startFreq + (endFreq - startFreq) * t / dur;
                  samples[iSample] = waveFn(freq, t, iSample);

                  if (Math.abs(samples[iSample]) > maxAmp) {
                      maxAmp = Math.abs(samples[iSample]);
                  }
              }
          }


          // Normalize and apply volume.
          for (iSample = 0; iSample < nSamples; ++iSample) {
              samples[iSample] = samples[iSample] / maxAmp * Math.min(1.0, vol);
          }

          // Ramp up the opening samples.
          samples[0] = 0.0;
          samples[1] *= 0.333;
          samples[2] *= 0.667;

          // Ramp down the closing samples.
          samples[nSamples - 1] = 0.0;
          samples[nSamples - 2] *= 0.333;
          samples[nSamples - 3] *= 0.667;
      }

      return buffer;
  },

  newSoundFromBuffer: function(buffer, duration) {
      var self = this;

      return {
          duration: duration,
          node: null,
          play: function() {
              this.node = self.audioContext.createBufferSource();
              this.node.buffer = buffer;
              this.node.onEnded = function() {
                  this.node.disconnect(jb.sound.audioContext.destination);
                  this.node = null;
              }
              this.node.connect(jb.sound.audioContext.destination);
              this.node.start(0);
          },
          stop: function() {
              if (this.node) {
                  this.node.stop();
              }
              this.node = null;
          }
      };
  }
};

jb.sound.init();

jb.program = {
  defaultRoutine: function() {
      jb.setBackColor("black");
      jb.setForeColor("red");
      jb.print("No program defined!");
      jb.setForeColor("gray");
  }
};

// Start the game!
window.onload = function() {
  jb.run(jb.program);
};
