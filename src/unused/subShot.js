// Create an object that will be the game:
jb.program = {
    // Variables and data //////////////////////////////////////////////////////
    BACK_COLOR: "rgba(0, 32, 128, 1)",
    SKY_COLOR: "rgba(64, 128, 255, 1)",
    NUM_LANES: 10,
    SKY_HEIGHT: 0.2,
    MAX_CLOUDS: 20,
    MAX_CLOUD_SCALE: 4,
    STATE: {DEAD: 0, OK: 1},
    SHIP: {X: 50, Y: 12, SCALE_X: 4, SCALE_Y: 2, SUB_OFFSET_Y: 4},
    TORPEDO: {SPEED: 250, DETONATE_RADIUS: 50, FADE_RADIUS: 200, START_DX: -16, START_DY: 14},
    HIDE_SUB_TIME: 2,
    MISSILE_LAUNCH_X: 16,
    MISSILE_SPEED: 500,
    FLAME_ANIM_TIME: 0.25,
    RIPPLE_TIME: 0.33,
    NUM_RIPPLES: 3,
    RIPPLE_SPACING: 3,
    RIPPLE_RADIUS: 100,
    RIPPLE_ASPECT: 0.25,
    FIREBALL_RAD: 200,
    FIREBALL_TIME: 0.25,
    WINNING_SCORE: 3,
    SUB_REVEAL_TIME: 1,
    SUB_SURFACE_HEIGHT: 20,
    ALARM_REPLAY_FACTOR: 2.67,

    message: null,
    bottomMessage: null,
    messageRGB: "0, 0, 0",
    clouds: [],
    yTop: 0,
    laneHeight: 0,
    destroyer: {lane: -1, state: 0, target: -1, score: 0},
    sub: {lane: -1, state: 0, hidingSpots: [], targetLanes: [], score: 0},
    missile: {x: 0, y: 0, animFrames: ["missile01up", "missile01up2"], frame: 0, targetY: 0, targetLane: 0, scale_x: 1, scale_y: 2, sound: null},
    torpedo: {x: 0, y: 0, dirX: 0, dirY: 0, glyph: "torpedoLeft", targetX: 0, targetY: 0, targetLane: 0, scale_x: 2, scale_y: 1, sound: null},
    hitSound: jb.sound.makeSound("pinkNoise", 0.5, 0.5, 50, 100),
    missSound: jb.sound.makeSound("sine", 0.2, 0.5, 30, 600),
    alarmSound: jb.sound.makeSound("saw", 0.5, 0.5, 50, 200),
    tapSound: jb.sound.makeSound("square", 0.05, 0.1, 600, 600),

    // DEBUG:
    fps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    iFPS: -1,

    // Functions ///////////////////////////////////////////////////////////////
    setUp: function() {
        jb.resize(1024, 768);

        // Compute constants used to draw the shipping lanes.
        this.yTop = Math.round(jb.canvas.height * this.SKY_HEIGHT);
        this.laneHeight = Math.round((jb.canvas.height - this.yTop) / this.NUM_LANES);

        jb.resize(jb.canvas.width, this.yTop + this.NUM_LANES * this.laneHeight);

        this.missile.sound = jb.sound.makeSound("noise", 4, 0.1);
        this.torpedo.sound = jb.sound.makeSound("pinkNoise", 5, 0.1, 80, 120);
    },

    startGame: function() {
        var numClouds = 0,
            iCloud = 0,
            scale = 1,
            cloudGlyph = null,
            newCloud = null;

        jb.setBackColor(this.BACK_COLOR);
        jb.clear();

        this.clouds.length = 0;

        // Randomly position some clouds (but don't draw them, yet!).
        for (iCloud = 0; iCloud < this.MAX_CLOUDS; ++iCloud) {
            numClouds += Math.round(Math.random());
        }

        scale = 2 + Math.floor(Math.random() * this.MAX_CLOUD_SCALE);

        for (iCloud = 0; iCloud < numClouds; ++iCloud) {
            newCloud = {glyph: null, xScale: scale, yScale: scale - Math.round(Math.random()), x: 0, y: 0};
            newCloud.glyph = Math.random() < 0.5 ? "cloud01" : "cloud02";
            newCloud.x = Math.floor(Math.random() * (jb.canvas.width - 16 * newCloud.xScale));
            newCloud.y = Math.floor(Math.random() * (jb.canvas.height * this.SKY_HEIGHT - 16 * newCloud.yScale));

            // Add this cloud to the list.
            this.clouds.push(newCloud);
        }

        this.sub.score = 0;
        this.destroyer.score = 0;
    },

    instructions: function() {
        this.message = null;
        this.banner = null;

        jb.fonts.printAt("military", 1, 40, "***Sub Shot***", "yellow", 0.5, 0.0, 4);
        jb.fonts.printAt("military", 7, 40, "Sink the enemy sub!`", "gray", 0.5, 0.0, 2);
        jb.fonts.printAt("military", 9, 40, "Place your destroyer in one of the shipping lanes.`", "gray", 0.5, 0.0, 1);
        jb.fonts.printAt("military", 10, 40, "Then, tap a lane to launch an anti-submarine missile.`", "gray", 0.5, 0.0, 1);
        jb.fonts.printAt("military", 11, 40, "After you fire, the sub will launch a torpedo.`", "gray", 0.5, 0.0, 1);
        jb.fonts.printAt("military", 12, 40, "If you survive, you can fire another missile, but`", "gray", 0.5, 0.0, 1);
        jb.fonts.printAt("military", 13, 40, "the sub moves to a new lane each turn. It will never`", "gray", 0.5, 0.0, 1);
        jb.fonts.printAt("military", 14, 40, "return to a lane from which it has already fired.`", "gray", 0.5, 0.0, 1);
        jb.fonts.printAt("military", 16, 40, "<TAP> to start!", "gray", 0.5, 0.0, 2);

        jb.startTimer("alarm");
        this.alarmSound.play();

        jb.listenForTap();
    },

    do_waitForStartTap: function() {
        if (jb.timer("alarm") > this.alarmSound.duration * this.ALARM_REPLAY_FACTOR &&
            jb.timerLast("alarm") <= this.alarmSound.duration * this.ALARM_REPLAY_FACTOR) {
            this.alarmSound.play();
        }

        jb.until(jb.tap.done);
    },

    setupPlaceDestroyer: function() {
        this.messageRGB = "0, 0, 0";
        this.message = "Tap to place your ship.";
        jb.listenForTap();
        this.tapSound.play();

        this.destroyer.state = this.STATE.OK;
    },

    do_placeDestroyer: function() {
        var lane = this.laneFromTap();

        this.drawBoard();

        if (lane >= 0) {
            this.destroyer.lane = lane;
            this.destroyer.state = this.STATE.OK;
        }

        jb.until(lane >= 0);
    },

    setupHideSub: function() {
        jb.startTimer("hideSub");

        this.tapSound.play();
        this.sub.state = this.STATE.OK;
        this.sub.hidingSpots.length = 0;
        this.sub.targetLanes.length = 0;
    },

    do_hideSub: function() {
        var timePassed = jb.timer("hideSub");

        this.message = "New sub arrives!";

        if (timePassed < this.HIDE_SUB_TIME * 0.25) {
            this.messageRGB = "0, 0, 0";
        }
        else if (timePassed < this.HIDE_SUB_TIME * 0.5) {
            this.messageRGB = "255, 0, 0";
        }
        else if (timePassed < this.HIDE_SUB_TIME * 0.75) {
            this.messageRGB = "0, 0, 0";
        }
        else {
            this.messageRGB = "255, 0, 0";
        }

        this.drawBoard();
        this.drawDestroyer();

        jb.until(jb.timer("hideSub") > this.HIDE_SUB_TIME);
    },

    setupPlayerShot: function() {
        // Proceed to the next phase, where we wait for the player
        // to fire a missile.
        this.messageRGB = "0, 0, 0";
        this.message = "Tap a lane to fire.";
        this.moveSubToNewLane();
        this.sub.state = this.STATE.OK;
        jb.listenForTap();
    },

    do_waitForPlayerShot: function() {
        var lane = this.laneFromTap();

        if (lane >= 0) {
            // User selected a valid target lane, so set up the missile launch.
            this.missile.scale_y = 2;
            this.missile.x = this.SHIP.X + this.MISSILE_LAUNCH_X;
            this.missile.y = this.yFromLane(this.destroyer.lane) + this.SHIP.Y + 16 * this.SHIP.SCALE_Y - 8 * this.missile.scale_y;
            this.missile.targetY = Math.round(this.yFromLane(lane) + this.laneHeight * 0.5);
            this.missile.frame = 0;
            this.missile.targetLane = lane;
            jb.startTimer("missileFlame");
            this.message = null;
        }

        this.drawBoard();
        this.drawDestroyer();

        jb.until(lane >= 0);
    },

    fireMissile: function() {
        this.missile.sound.play();
    },

    do_missileUp: function() {
        var missileOnScreen = this.missile.y > -8 * this.missile.scale_y;

        this.missile.y -= Math.round(this.MISSILE_SPEED * jb.time.deltaTime);

        if (jb.timer("missileFlame") > this.FLAME_ANIM_TIME) {
            this.missile.frame += 1;
            this.missile.frame %= this.missile.animFrames.length;
            jb.setTimer("missileFlame", jb.timer("missileFlame") - this.FLAME_ANIM_TIME);
        }

        this.drawBoard();
        this.drawMissile();
        this.drawDestroyer();

        if (!missileOnScreen) {
            // Reverse direction of missile and move it
            // to the opposite side of the screen.
            this.missile.x = jb.canvas.width - 16 * this.SHIP.SCALE_X;
            this.missile.scale_y = -2;
            jb.startTimer("missileFlame");
        }

        jb.while(missileOnScreen);
    },

    do_missileDown: function() {
        var missileAtTarget = false;

        this.missile.y += Math.round(this.MISSILE_SPEED * jb.time.deltaTime);
        missileAtTarget = this.missile.y > this.missile.targetY;

        this.missile.y = Math.min(this.missile.y, this.missile.targetY);

        if (jb.timer("missileFlame") > this.FLAME_ANIM_TIME) {
            this.missile.frame += 1;
            this.missile.frame %= this.missile.animFrames.length;

            jb.setTimer("missileFlame", jb.timer("missileFlame") - this.FLAME_ANIM_TIME);
        }

        this.drawBoard();
        this.drawMissile();
        this.drawDestroyer();

        jb.until(missileAtTarget);
    },

    setupMissileSplashdown: function() {
        // Force the missile to end in exactly the right place.
        this.missile.y = this.yForLane(this.missile.targetLane) + Math.round(this.laneHeight * 0.5);
        this.missile.sound.stop();

        this.missSound.play();

        jb.startTimer("ripples");
    },

    do_missileSplashdownLoop: function() {
        var i = 0,
            rippleAlpha = 0,
            radX = 0;

        radX = jb.timer("ripples") * this.RIPPLE_RADIUS;

        this.drawBoard();
        this.drawDestroyer();

        jb.ctxt.save();
        jb.ctxt.translate(this.missile.x + 8 / 2 * this.missile.scale_x, this.missile.y - 8 / 2 * this.missile.scale_y);
        jb.ctxt.scale(1, this.RIPPLE_ASPECT);

        rippleAlpha = 1.0 - radX / (this.RIPPLE_TIME * this.RIPPLE_RADIUS);
        rippleAlpha = Math.max(0, rippleAlpha);

        for (i = 0; i < this.NUM_RIPPLES && radX > 0; ++i) {
            jb.ctxt.beginPath();
            jb.ctxt.fillStyle = "rgba(255, 255, 255, " + rippleAlpha + ")";
            jb.ctxt.arc(0, 0, radX, 0, 2 * Math.PI, false);
            jb.ctxt.fill();

            radX -= this.RIPPLE_SPACING;

            if (radX > 0) {
                jb.ctxt.beginPath();
                jb.ctxt.fillStyle = this.getLaneColor(this.missile.targetLane);
                jb.ctxt.arc(0, 0, radX, 0, 2 * Math.PI, false);
                jb.ctxt.fill();
                radX -= this.RIPPLE_SPACING;
            }
        }

        jb.ctxt.restore();

        if (jb.timer("ripples") >= this.RIPPLE_TIME) {
            // Check for hit on sub.
            if (this.missile.targetLane === this.sub.lane) {
                jb.goto("hitSub");
            }
            else {
                this.message = "Missed. Sub attacks!";
            }
        }

        jb.until(jb.timer("ripples") >= this.RIPPLE_TIME);
    },

    setupSubSurface: function() {
        jb.startTimer("subSurface");
    },

    do_subSurface: function() {
        var cloakParam = 0;

        cloakParam = Math.min(1.0, jb.timer("subSurface") / this.SUB_REVEAL_TIME);

        this.drawBoard();
        this.drawDestroyer();
        this.drawTransitioningSub(cloakParam);

        jb.while(cloakParam < 1.0);
    },

    setupSubFires: function() {
        var len = 0;

        this.getNewSubTarget();

        this.torpedo.x = jb.canvas.width - this.SHIP.X - 16 * this.SHIP.SCALE_X + this.TORPEDO.START_DX;
        this.torpedo.y = this.laneToSubY(this.sub.lane) - this.SUB_SURFACE_HEIGHT + this.TORPEDO.START_DY;
        this.torpedo.targetX = this.SHIP.X;
        this.torpedo.targetY = this.yFromLane(this.torpedo.targetLane) + Math.round(this.SHIP.Y + 16 * this.SHIP.SCALE_Y * 0.5);
        this.torpedo.dirX = this.torpedo.targetX - this.torpedo.x;
        this.torpedo.dirY = this.torpedo.targetY - this.torpedo.y;
        len = Math.sqrt(this.torpedo.dirX * this.torpedo.dirX + this.torpedo.dirY * this.torpedo.dirY);
        this.torpedo.dirX /= len;
        this.torpedo.dirY /= len;

        this.torpedo.sound.play();

        jb.startTimer("subSurface");
    },

    do_subFires: function() {
        var cloakParam = 0,
            dx = 0,
            dy = 0,
            distToTarget = 0;

        cloakParam = 1.0 - Math.min(1.0, jb.timer("subSurface") / this.SUB_REVEAL_TIME);

        this.torpedo.x += this.torpedo.dirX * jb.time.deltaTime * this.TORPEDO.SPEED;
        this.torpedo.y += this.torpedo.dirY * jb.time.deltaTime * this.TORPEDO.SPEED;

        dx = this.torpedo.targetX - this.torpedo.x;
        dy = this.torpedo.targetY - this.torpedo.y;

        distToTarget = Math.sqrt(dx * dx + dy * dy);

        this.drawBoard();

        if (distToTarget < this.TORPEDO.FADE_RADIUS) {
            jb.ctxt.globalAlpha = distToTarget / this.TORPEDO.FADE_RADIUS;
        }
        this.drawTorpedo();
        jb.ctxt.globalAlpha = 1.0;
        this.drawDestroyer();

        this.drawTransitioningSub(cloakParam);

        jb.while(dx * this.torpedo.dirX + dy * this.torpedo.dirY > 0);
    },

    checkTorpedoHitsPlayer: function() {
        this.torpedo.sound.stop();

        if (this.torpedo.targetLane !== this.destroyer.lane) {
            jb.goto("setupPlayerShot");
        }
    },

    setupHitDestroyer: function() {
        jb.startTimer("explosion");
        jb.startTimer("subSurface");
        this.hitSound.play();
    },

    do_hitDestroyer: function() {
        // Fireball.
        var x = Math.round(this.torpedo.x + 16 * this.SHIP.SCALE_X * 0.5),
            y = Math.round(this.torpedo.y + 8 * this.SHIP.SCALE_Y * 0.5);

        this.drawBoard();
        this.drawFireball(jb.timer("explosion"), this.torpedo.targetLane, x, y);

        jb.ctxt.globalAlpha = 1.0 - Math.min(1.0, jb.timer("explosion") / this.FIREBALL_TIME);
        this.drawDestroyer();
        jb.ctxt.globalAlpha = 1.0;

        jb.until(jb.timer("explosion") >= this.FIREBALL_TIME);
    },

    resolveHitDestroyer: function() {
        this.sub.score += 1;
        this.destroyer.state = this.STATE.DEAD;
        jb.goto("setupEndRound");
    },

    hitSub: function() {
        this.destroyer.score += 1;
        this.sub.state = this.STATE.DEAD;
        this.hitSound.play();
        jb.startTimer("explosion");
    },

    do_hitSub: function() {
        // Fireball.
        var x = Math.round(this.missile.x + 8 * this.missile.scale_x * 0.5),
            y = Math.round(this.missile.y - 8 * this.missile.scale_y * 0.5);

        this.drawBoard();
        this.drawFireball(jb.timer("explosion"), this.missile.targetLane, x, y);
        this.drawDestroyer();

        jb.until(jb.timer("explosion") >= this.FIREBALL_TIME);
    },

    setupEndRound: function() {
        jb.listenForTap();

        if (this.sub.state === this.STATE.DEAD) {
            this.messageRGB = "0, 128, 0";
            this.banner = "Hit!";
            this.message = "You: " + this.destroyer.score + " Sub: " + this.sub.score;
        }
        else if (this.destroyer.state === this.STATE.DEAD) {
            this.messageRGB = "255, 0, 0";
            this.message = "You: " + this.destroyer.score + " Sub: " + this.sub.score;
        }

        this.bottomMessage = "<Tap> to continue..."
    },

    do_endRound: function() {
        this.drawBoard();
        this.drawDestroyer();

        jb.until(jb.tap.done);
    },

    endRound: function() {
        this.banner = null;
        this.bottomMessage = null;
        this.tapSound.play();

        if (this.destroyer.score >= this.WINNING_SCORE ||
            this.sub.score >= this.WINNING_SCORE) {
            jb.goto("gameOver");
        }
        else if (this.sub.state === this.STATE.DEAD) {
            jb.goto("setupHideSub");
        }
        else if (this.destroyer.state === this.STATE.DEAD) {
            jb.goto("setupPlaceDestroyer");
        }
    },

    gameOver: function() {
        this.messageRGB = "0, 0, 0";
        this.message = "<TAP> to play again.";

        if (this.destroyer.score >= this.WINNING_SCORE) {
            this.banner = "YOU WIN!";
        }

        if (this.sub.score >= this.WINNING_SCORE) {
            this.banner = "YOU LOSE";
        }

        jb.listenForTap();
    },

    do_gameOver: function() {
        this.drawBoard();

        if (this.destroyer.score >= this.WINNING_SCORE) {
            this.drawDestroyer();
        }

        jb.until(jb.tap.done);
    },

    playAgain: function() {
        jb.goto("startGame");
    },

    // Helper Functions ///////////////////////////////////////////////////////
    showFPS: function() {
        var i = 0,
            total = 0;

        this.iFPS += 1;
        this.iFPS %= this.fps.length;

        this.fps[this.iFPS] = jb.time.deltaTime;

        for (i=0; i<this.fps.length; ++i) {
            total += this.fps[i];
        }

        total = Math.round(total / this.fps.length * 1000);
        this.message = "Ave DT: " + total + " ms";
    },

    laneFromTap: function() {
        var lane = -1;

        if (jb.tap.done) {
            lane = (jb.tap.y - this.yTop) / this.laneHeight;

            if (lane >= 0) {
                lane = Math.floor(lane);
                lane = Math.min(lane, this.NUM_LANES - 1);
            }
            else {
                // User tapped the sky. Try again.
                jb.listenForTap();
            }
        }

        return lane;
    },

    yFromLane: function(lane) {
        return Math.round(this.yTop + Math.min(Math.max(0, lane), this.NUM_LANES - 1) * this.laneHeight);
    },

    yForLane: function(lane) {
        return lane * this.laneHeight + this.yTop;
    },

    laneToSubY: function(lane) {
        return this.yFromLane(lane) + this.laneHeight - 1 - 16 * this.SHIP.SCALE_Y + this.SHIP.SUB_OFFSET_Y;
    },

    getLaneColor: function(lane) {
        return "rgba(0, 0, " + 25 * (lane + 1) + ", 1)";
    },

    drawFireball: function(t, lane, x, y) {
        var rad = 0,
            yStart = Math.round(y + this.FIREBALL_RAD * 0.0167),
            alpha = Math.max(0, 1.0 - t / this.FIREBALL_TIME);

        if (t < this.FIREBALL_TIME) {
            rad = Math.round(t * this.FIREBALL_RAD);
            y -= Math.round(t * this.laneHeight * 0.1);

            jb.ctxt.save();

            jb.ctxt.beginPath();
            jb.ctxt.fillStyle = "rgba(255, 128, 0, " + alpha + ")";
            jb.ctxt.arc(x, y, rad, 0, 2 * Math.PI, false);
            jb.ctxt.fill();

            jb.ctxt.beginPath();
            jb.ctxt.fillStyle = this.getLaneColor(lane);
            jb.ctxt.fillRect(x - rad, yStart, 2 * rad, this.yForLane(lane + 1) - yStart);

            this.drawLane(lane + 1);

            jb.ctxt.beginPath();
            jb.ctxt.fillStyle = "rgba(255, 255, 255, " + Math.sqrt(alpha) + ")";
            jb.ctxt.fillRect(x - Math.round(rad * 1.25), yStart, Math.round(2.5 * rad), 1);

            jb.ctxt.restore();
        }
    },

    drawBoard: function() {
        var iWave = 0,
            iCloud = 0;

        // Fill background
        jb.setBackColor(this.SKY_COLOR);
        jb.clear();

        for (iWave = 0; iWave < this.NUM_LANES; ++iWave) {
            jb.ctxt.fillStyle = this.getLaneColor(iWave);
            jb.ctxt.fillRect(0, this.yTop + this.laneHeight * iWave, jb.canvas.width, this.laneHeight); 
        }

        jb.ctxt.fillRect(0, this.yTop + this.laneHeight * (this.NUM_LANES - 1), jb.canvas.width, jb.canvas.height - this.laneHeight * (this.NUM_LANES - 1));

        // Draw the clouds
        for (iCloud = 0; iCloud < this.clouds.length; ++iCloud) {
            jb.glyphs.draw("16x16",
                           this.clouds[iCloud].glyph,
                           this.clouds[iCloud].x,
                           this.clouds[iCloud].y,
                           this.clouds[iCloud].xScale,
                           this.clouds[iCloud].yScale);
        }

        if (this.message) {
            jb.colorRows("rgba(" + this.messageRGB + ", 0.85)", 3, 4);
            jb.fonts.printAt("military", 3.5, 40, this.message, "white", 0.5, 0.0, 2);
        }

        if (this.banner) {
            jb.fonts.printAt("military", Math.round(jb.rows / 2), 40, this.banner, "white", 0.5, 0.0, 4);
        }

        if (this.bottomMessage) {
            jb.colorRows("rgba(0, 0, 0, 0.85)", jb.rows - 2, jb.rows - 1);
            jb.fonts.printAt("military", jb.rows - 1.5, 40, this.bottomMessage, "white", 0.5, 0.0, 1);
        }
    },

    drawLane: function(lane) {
        if (lane < this.NUM_LANES) {
            jb.ctxt.fillStyle = this.getLaneColor(lane);
            jb.ctxt.fillRect(0, this.yTop + this.laneHeight * lane, jb.canvas.width, this.laneHeight); 
        }
    },

    drawDestroyer: function() {
        if (this.destroyer.state === this.STATE.OK) {
            jb.glyphs.draw("16x16",
                           "destroyerRight",
                           this.SHIP.X,
                           this.yFromLane(this.destroyer.lane) + this.SHIP.Y,
                           this.SHIP.SCALE_X,
                           this.SHIP.SCALE_Y);
        }
    },

    drawSub: function(subY) {
        if (this.sub.state === this.STATE.OK) {
            jb.glyphs.draw("16x16",
                           "submarineLeft",
                           jb.canvas.width - this.SHIP.X - 16 * this.SHIP.SCALE_X,
                           subY || this.laneToSubY(this.sub.lane),
                           this.SHIP.SCALE_X,
                           this.SHIP.SCALE_Y);
        }
    },

    drawTorpedo: function() {
        jb.glyphs.draw("8x8",
                       this.torpedo.glyph,
                       this.torpedo.x,
                       this.torpedo.y,
                       this.torpedo.scale_x,
                       this.torpedo.scale_y);
    },

    drawMissile: function() {
        jb.glyphs.draw("8x8",
                       this.missile.animFrames[this.missile.frame],
                       this.missile.x,
                       this.missile.y,
                       this.missile.scale_x,
                       this.missile.scale_y);
    },

    drawTransitioningSub: function(cloakParam) {
        var yCloak = 0,
            laneBottom = this.yFromLane(this.sub.lane) + this.laneHeight - 1,
            subX = 0,
            subY = 0;

        subX = jb.canvas.width - this.SHIP.X - 16 * this.SHIP.SCALE_X;
        subY = this.laneToSubY(this.sub.lane) - this.SUB_SURFACE_HEIGHT * cloakParam;

        jb.ctxt.globalAlpha = cloakParam;
        this.drawSub(subY);
        jb.ctxt.globalAlpha = 1.0;

        yCloak = this.laneToSubY(this.sub.lane) + Math.round(0.25 * 16 * this.SHIP.SCALE_Y);

        jb.ctxt.save();
        jb.ctxt.beginPath();
        jb.ctxt.fillStyle = this.getLaneColor(this.sub.lane);
        jb.ctxt.fillRect(subX, yCloak, 16 * this.SHIP.SCALE_X, laneBottom - yCloak);
        jb.ctxt.fill();

        jb.ctxt.restore();
    },

    moveSubToNewLane: function() {
        var bHidden = false,
            lane = 0,
            i = 0
            nextLane = Math.random() < 0.5 ? 1 : -1;

        lane = Math.floor(Math.random() * this.NUM_LANES);
        while (!bHidden) {
            bHidden = true;

            // Look through the hiding spots already used...
            for (i=0; i<this.sub.hidingSpots.length; ++i) {
                // ...if this is a used lane...
                if (this.sub.hidingSpots[i] === lane) {
                    // ...move to the next lane...
                    lane = lane + nextLane;

                    // ...handle underflow...
                    if (lane < 0) {
                        lane = this.NUM_LANES - 1;
                    }
                    else {
                        // ...and overflow.
                        lane = lane % this.NUM_LANES;
                    }

                    // ...and try again with this new lane.
                    bHidden = false;
                    break;
                }
            }
        }

        this.sub.lane = lane;
        this.sub.hidingSpots.push(this.sub.lane);
    },

    getNewSubTarget: function() {
        var bHidden = false,
            lane = 0,
            i = 0,
            tries = 0,
            nextLane = Math.random() < 0.5 ? 1 : -1;

        lane = Math.floor(Math.random() * this.NUM_LANES);

        while (!bHidden) {
            bHidden = true;

            // Look through the target lanes already used...
            for (i=0; i<this.sub.targetLanes.length; ++i) {
                // ...if this is a used lane...
                if (this.sub.targetLanes[i] === lane) {
                    // ...move to the next lane...
                    lane = lane + nextLane;

                    // Handle underflow...
                    if (lane < 0) {
                        lane = this.NUM_LANES - 1;
                    }
                    else {
                        // ...and overflow.
                        lane = lane % this.NUM_LANES;
                    }

                    // ...and try again with this new lane.
                    bHidden = false;
                    ++tries;
                    if (tries >= 10) {
                        debugger;
                    }
                    break;
                }
            }
        }

        this.torpedo.targetLane = lane;
        this.sub.targetLanes.push(lane);
    }
};
