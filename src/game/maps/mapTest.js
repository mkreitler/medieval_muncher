jb.mapTest = {
    maps: {
        dungeon: [
            "******************************************",
            "**P.........**..............**........P.**",
            "**..******..**..**********..**..******..**",
            "**......**......................**......**",
            "**..**..**..**..****..****..**..**..**..**",
            "**..**..**..**..............**..**..**..**",
            "**......**..********..********..**......**",
            "**..**..............gg..............**..**",
            "**..**..****..******dd******..****..**..**",
            "**..**..****..**1,,,,,,,4,**..****..**..**",
            "t2............**2,,,,,,,5,**............t1",
            "**..**..****..**3,,,,,,,6,**..****..**..**",
            "**..**..****..******dd******..****..**..**",
            "**..**..............gg..............**..**",
            "**..**..************..************..**..**",
            "**..................s...................**",
            "****..****..******..**..******..****..****",
            "**....**....**......**......**....**....**",
            "**..****..****..**********..****..****..**",
            "**P...................................P.**",
            "******************************************",
        ],
        crypt: [
            "********t4********************************",
            "**............P.........................**",
            "**..**********..**...*********..******..**",
            "t3..**1,,,2,**..**..............**......**",
            "**..****dd****..******..**..**....****..**",
            "**......gg..**..........**..******......**",
            "**..****..****....********..........******",
            "**..**............**......************..**",
            "**..**..************..**........**....P.**",
            "**......**........**..****..**..******..**",
            "**..**..****..**......****..**..........t2",
            "**..**..**....****..**..**..**********..**",
            "**..**......****..s.....**..**3,,,4,**..**",
            "**..**..**..******..******..****dd****..**",
            "**......******......**..........gg......**",
            "**..******..**..**..**..********..****..**",
            "****........**..**......P.**..**....**..**",
            "**....****......**..****..**..****..**..**",
            "**..**......**..**..****........**..**..**",
            "**P.....**..**..**........****..........**",
            "********************************t1********",
        ],
        labyrinth: [
            "******************************************",
            "**P...................................P.**",
            "**..****************..**..****..******..**",
            "**..**t5........t6**..**....**......**..**",
            "**..****************..****..******..**..**",
            "**......................................**",
            "**....****..**..****..****..**....****..**",
            "**..****................gg....**........**",
            "**..****..**..**********dd**..**..****..**",
            "**........**..****1...3.****......**....**",
            "****..**..**..**t7..**..t8**..**..**..****",
            "**....**..s...****2...4.****..**........t1",
            "**..****..**..**dd**********..**..****..**",
            "**........**....gg...............****...**",
            "**..****....**..****..****..**..****....**",
            "**......................................**",
            "**..**..******..****..****************..**",
            "**..**......**....**..**t2........t3**..**",
            "**..******..****..**..****************..**",
            "t4P...................................P.**",
            "******************************************",
        ],
        labyrinth02: [
            "********************t6********************",
            "**..............**......................**",
            "**..****..****..**..******..**************",
            "**......P...........**P.................t4",
            "******************..**..................**",
            "**..................***..*****************",
            "**..**************..**..................**",
            "**......**....gg........************..****",
            "**..**..**..**dd********P...............**",
            "**..P...**..**......3.****..**..**..**..**",
            "**..**......**1.....******..........**..**",
            "**......**..**..**..t5**....**..**......**",
            "**..**..**..**2.....****..************..**",
            "**********..**......4.**..**........**..**",
            "**......**..******dd****..****......**..**",
            "**..**..**......**gg**....**t2..**..**..**",
            "**......******......****..****......**..**",
            "t3..**......**..**....**..**........**..**",
            "**......**......****..**..************..**",
            "**P.........**......s.................P.**",
            "********************t1********************",
        ],
        labyrinth01: [
            "********************t4********************",
            "**......................................**",
            "**..********..******..**....**********..**",
            "**....P...........**..****......**......**",
            "**..**..**..****..**..**P...**gg....**..**",
            "**..**..**..****..**..********dd******..**",
            "**......**........**..**1.......3.t3**..**",
            "**..**..********..**..**..****..******..**",
            "**..**............**..**2.........4.**..**",
            "**..****..******..**..******dd********..**",
            "**..**....**......**s.......g...........**",
            "**......****..******..******..****..******",
            "**..**..**........**..**......**........**",
            "**......**..****..**..**..**..******..****",
            "**..******..****..**..**..............****",
            "t2..**........**..**..**..******..**..P.**",
            "**..**..****..**..**..**..**......****..**",
            "**......**....P...**..**......**....**..**",
            "**..******..********..************..**..**",
            "**......................................**",
            "********************t1********************",
        ],
    },

    map: null,
    start: {x: -1, y: -1},
    monsterStart:[],
    monsterGoals: [],
    teleporters: [],
    tileSize: 0,
    scale: 0,
    canvas: null,
    origin: null,
    canvas: null,
    tileTypeIndices: [9, 15, 10, 18, 13, 14, 16, 23, 12, 19, 11, 24, 17, 22, 21, 20],
    collisionBounds: new jb.bounds(0, 0, 0, 0),
    collisionInfo: {isOutOfBounds: false, isBlocked: false, blockInfo: null},
    adjacentInfo: {leftClear: false, rightClear: false, yIdeal: -1},
    treasureSite: {x: -1, y: -1},
    adjacents: {
        center: {dx: 0, dy: 0},
        up: {dx: 0, dy: -1},
        right: {dx: 1, dy: 0},
        down: {dx: 0, dy: 1},
        left: {dx: -1, dy: 0},
    },

    getTreasureSpawnSite: function() {
        var candidates = [];
        var site = null;

        for (var i=0; i<this.monsterGoals.length; ++i) {
            var goal = this.monsterGoals[i];
            var row = this.rowFromY(goal.y);
            var col = this.colFromX(goal.x);

            // A little filthy, calling the bank directly...
            if (!jb.bank.isCoinAt(row, col)) {
                candidates.push(i);
            }
        }

        if (candidates.length > 0) {
            var index = jb.popRandom(candidates);
            this.treasureSite.x = (this.monsterGoals[index].x + this.tileSize * this.scale / 2) / this.scale;
            this.treasureSite.y = (this.monsterGoals[index].y + this.tileSize * this.scale / 2) / this.scale;
            site = this.treasureSite;
        }

        return site;
    },

    resetCollisionInfo: function() {
        this.collisionInfo.isOutOfBounds = false;
        this.collisionInfo.isBlocked = false;
        this.blockInfo = null;
    },

    getBlockedInfo: function(x, y, dir) {
        var row = this.rowFromY(y);
        var col = this.colFromX(x);
        var result = null;

        this.resetCollisionInfo();

        if (row < 0 || row > this.map.length - 1 || col < 0 || col > this.map[row].length - 1) {
            this.collisionInfo.isOutOfBounds = true;
            this.collisionBounds.set(this.xFromCol(col), this.yFromRow(row), this.tileSize * this.scale, this.tileSie * this.scale);
            this.collisionInfo.blockInfo = this.collisionBounds;
            result = this.collisionInfo;
        }
        else if (this.map[row][2 * col] === '*') {
            this.collisionInfo.isBlocked = true;
            this.collisionBounds.set(this.xFromCol(col), this.yFromRow(row), this.tileSize * this.scale, this.tileSie * this.scale);
            this.collisionInfo.blockInfo = this.collisionBounds;
            result = this.collisionInfo;
        }

        return result;
    },

    startX: function() {
        return this.start.x;
    },

    startY: function() {
        return this.start.y;
    },

    rowFromY: function(y) {
        return Math.floor((y - this.origin.y) / (this.tileSize * this.scale));
    },

    colFromX: function(x) {
        return Math.floor((x - this.origin.x) / (this.tileSize * this.scale));
    },

    yFromRow: function(row, size) {
        size = size || this.tileSize;
        return this.origin.y + row * size * this.scale;
    },

    xFromCol: function(col, size) {
        size = size || this.tileSize;
        return this.origin.x + col * size * this.scale;
    },

    yFromRowCenter: function(row) {
        return this.yFromRow(row) + this.tileSize / 2 * this.scale;
    },

    xFromColCenter: function(col) {
        return this.xFromCol(col) + this.tileSize / 2 * this.scale;
    },

    fadeSprite: function(sprite) {
        var spriteX = sprite.bounds.l;
        var spriteY = sprite.bounds.t;

        var curRow = this.rowFromY(spriteY);
        var curCol = this.colFromX(spriteX);
        var minRadSq = Number.MAX_VALUE;

        for (var key in this.adjacents) {
            var offset = this.adjacents[key];
            if (this.isInBounds(curRow + offset.dy, curCol + offset.dx) && this.isCellTeleporter(curRow + offset.dy, curCol + offset.dx)) {
                var idealY = this.yFromRow(curRow + offset.dy);
                var idealX = this.xFromCol(curCol + offset.dx);

                var dx = idealX - spriteX;
                var dy = idealY - spriteY;
                minRadSq = Math.min(dx * dx + dy * dy, minRadSq);
            }
        }

        var radNormSq = this.tileSize * this.scale;
        radNormSq *= radNormSq;
        var p = (radNormSq - minRadSq) / radNormSq;
        p = Math.max(0, p);
        p = Math.min(p, 1);

        sprite.spriteSetAlpha(1.0 - p);
    },

    collide: function(dir, body, dtMS) {
        jb.assert(body, "Can't check collision against 'null' object!");
        jb.assert(this.tileSize > 0 && this.scale > 0, "Map not initialized!");

        var b = body.bounds;
        var dt = dtMS * 0.001;

        b.copyTo(this.collisionBounds);

        var xMid = b.l + b.halfWidth - this.origin.x;
        var yMid = b.t + b.halfHeight - this.origin.y;
        var slipWidth = Math.round(b.halfWidth * jb.k.SLIP_THROUGH_SIZE);

        var x1 = xMid - slipWidth;
        var x2 = xMid + slipWidth;
        var y1 = yMid - slipWidth;
        var y2 = yMid + slipWidth;

        var row1 = this.rowFromY(y1 + this.origin.y);
        var row2 = this.rowFromY(y2 + this.origin.y);
        var col1 = this.colFromX(x1 + this.origin.x);
        var col2 = this.colFromX(x2 + this.origin.x);

        var rowMid = this.rowFromY(yMid + this.origin.y);
        var colMid = this.colFromX(xMid + this.origin.x);

        var xMidTarget = this.xFromCol(colMid) + b.halfWidth - this.origin.x;
        var yMidTarget = this.yFromRow(rowMid) + b.halfHeight - this.origin.y;

        var blendFastParam = 1.0 - Math.exp(-dt * jb.k.ALIGN_BLEND_FAST);
        var blendSlowParam = 1.0 - Math.exp(-dt * jb.k.ALIGN_BLEND_SLOW);

        var blendParam = blendFastParam;

        var doBlend = false;

        switch(dir) {
            case "up": {
                var blockedLeft = this.isPlayerBlocked(row1, col1);
                var blockedRight =  this.isPlayerBlocked(row1, col2);

                if (row1 < 0 || blockedLeft || blockedRight) {
                    row1 += 1;
                    this.collisionBounds.t = this.yFromRow(row1);
                    doBlend = blockedLeft !== blockedRight;
                    blendParam = blendSlowParam;
                }
                else {
                    doBlend = true;
                }

                if (doBlend) {
                    var x = xMid + (xMidTarget - xMid) * blendParam + this.origin.x;
                    this.collisionBounds.l = Math.round(x - b.halfWidth);
                }
            }
            break;

            case "right": {
                var blockedHigh = this.isPlayerBlocked(row1, col2);
                var blockedLow = this.isPlayerBlocked(row2, col2);

                if (col2 >= this.map[0].length / 2 ) {
                    var overage = b.l + b.w - this.origin.x - this.canvas.width;
                    var newX = overage + this.origin.x;
                    this.collisionBounds.l = newX;
                    doBlend = true;
                }
                else if (blockedHigh || blockedLow) {
                    col2 -= 1;
                    this.collisionBounds.l = this.xFromCol(col2);
                    doBlend = blockedHigh !== blockedLow;
                    blendParam = blendSlowParam;
                }
                else {
                    doBlend = true;
                }

                if (doBlend) {
                    var y = yMid + (yMidTarget - yMid) * blendParam + this.origin.y;
                    this.collisionBounds.t = Math.round(y - b.halfHeight);
                }
            }
            break;

            case "down": {
                var blockedLeft = this.isPlayerBlocked(row2, col1);
                var blockedRight =  this.isPlayerBlocked(row2, col2);

                if (row2 >= this.map.length || blockedLeft || blockedRight) {
                    row2 -= 1;
                    this.collisionBounds.t = this.yFromRow(row2);
                    doBlend = blockedLeft !== blockedRight;
                    blendParam = blendSlowParam;
                }
                else {
                    doBlend = true;
                }

                if (doBlend) {
                    var x = xMid + (xMidTarget - xMid) * blendParam + this.origin.x;
                    this.collisionBounds.l = Math.round(x - b.halfWidth);
                }
            }
            break;

            case "left": {
                var blockedHigh = this.isPlayerBlocked(row1, col1);
                var blockedLow = this.isPlayerBlocked(row2, col1);

                if (col1 < 0) {
                    var underage = b.l - this.origin.x;
                    var newX = this.canvas.width + underage - b.w + this.origin.x;
                    this.collisionBounds.l = newX;
                    doBlend = true;
                }
                else if (blockedHigh || blockedLow) {
                    col1 += 1;
                    this.collisionBounds.l = this.xFromCol(col1);
                    doBlend = blockedHigh !== blockedLow;
                    blendParam = blendSlowParam;
                }
                else {
                    doBlend = true;
                }

                if (doBlend) {
                    var y = yMid + (yMidTarget - yMid) * blendParam + this.origin.y;
                    this.collisionBounds.t = Math.round(y - b.halfHeight);
                }
            }
            break;

            default: {
                // Nothing to do in this case.
            }
            break;
        }

        return this.collisionBounds;
    },

    isDirectionBlocked: function(x, y, dir) {
        var row = this.rowFromY(y);
        var col = this.colFromX(x);

        switch(dir) {
            case "up": {
                row -= 1;
            }
            break;

            case "right": {
                col += 1;
            }
            break;

            case "down": {
                row += 1;
            }
            break;

            case "left": {
                col -= 1;
            }
            break;
        }

        return !this.isInBounds(row, col) || this.isPlayerBlocked(row, col);
    },

    areAdjacentsBlocked: function(bounds) {
        var xCenter = bounds.l + bounds.halfWidth;
        var yCenter = bounds.t + bounds.halfHeight;
        var row = this.rowFromY(yCenter);
        var col = this.colFromX(xCenter);
        var yIdeal = this.yFromRow(row) + bounds.halfHeight;

        if (Math.abs(yIdeal - yCenter) < bounds.halfHeight * jb.k.SPELL_TRIGGER_TOLERANCE) {
            if (this.isInBounds(row, col - 1)) {
                this.adjacentInfo.leftClear = !this.isPlayerBlocked(row, col - 1);
            }
            else {
                this.adjacentInfo.leftClear = false;
            }

            if (this.isInBounds(row, col + 1)) {
                this.adjacentInfo.rightClear = !this.isPlayerBlocked(row, col + 1);
            }
            else {
                this.adjacentInfo.rightClear = false;
            }

            this.adjacentInfo.yIdeal = yIdeal;
        }
        else {
            this.adjacentInfo.leftClear = false;
            this.adjacentInfo.rightClear = false;
        }

        return this.adjacentInfo;
    },

    isPlayerBlocked: function(row, col) {
        var blocked = false;

        if (row >= 0 && row < this.map.length) {
            if (col >= 0 && col < this.map[row].length) {
                var cell = this.map[row][2 * col]; 
                blocked = cell === '*' || cell === 'd';
            }
        }

        return blocked;
    },

    getMonsterStart: function() {
        return this.monsterStart[Math.floor(Math.random() * this.monsterStart.length)];
    },

    getMonsterGoal: function(bounds, goalOut) {
        jb.assert(bounds && goalOut, "Invalid goal data!");

        var nearestGoals = [];
        var bestDist = Number.MAX_VALUE;

        for (var i=0; i<this.monsterGoals.length; ++i) {
            var dist = Math.abs(bounds.t - this.monsterGoals[i].y);

            if (dist < bestDist - jb.k.EPSILON) {
                bestDist = dist;
                nearestGoals.length = 0;
                nearestGoals.push(this.monsterGoals[i]);
            }
            else if (Math.abs(bestDist - dist) < jb.k.EPSILON) {
                nearestGoals.push(this.monsterGoals[i]);
            }
        }

        jb.assert(nearestGoals.length > 0, "No valid goal!");

        var iGoal = Math.floor(Math.random() * nearestGoals.length);

        goalOut.x = nearestGoals[iGoal].x;
        goalOut.y = nearestGoals[iGoal].y;
    },

    init: function(mapType) {
        jb.assert(this.maps[mapType], "Unknown map type!");
        this.map = this.maps[mapType];
    },

    drawFloor: function(ctxt, tiles, floorRow, floorCol, x, y) {
        if (floorRow >= 0 && floorCol >= 0) {
            tiles.draw(ctxt, floorRow, floorCol, x, y);  
        }
    },

    create: function(tileSize, scale, origin, tiles, tileRow, doorRow, doorCol, floorRow, floorCol) {
        var coinPos = {row: -1, col: -1};
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.map[0].length / 2 * tileSize * scale;
        this.canvas.height = this.map.length * tileSize * scale;
        this.origin = origin;
        this.tileSize = tileSize;
        this.scale = scale;

        var ctxt = this.canvas.getContext("2d");
        var powerupInfo = {row: -1, col: -1, type: -1};

        ctxt.imageSmoothingEnabled = false;

        for (var iRow=0; iRow<this.map.length; ++iRow) {
            var y = iRow * Math.round(tileSize * scale);
            for (var iCol=0; iCol<this.map[iRow].length / 2; ++iCol) {
                var x = Math.round(iCol * tileSize * scale);
                var char = this.map[iRow][iCol * 2];

                switch (char) {
                    case '*': {
                        var type = iRow - 1 >= 0 ? (this.map[iRow - 1][iCol * 2] === '*' ? 1 : 0) : 0;
                        type += iRow + 1 < this.map.length ? (this.map[iRow + 1][iCol * 2] === '*' ? 4 : 0) : 0;
                        type += iCol + 1 < this.map[iRow].length / 2 ? (this.map[iRow][iCol * 2 + 2] === '*' ? 2 : 0) : 0;
                        type += iCol - 1 >= 0 ? (this.map[iRow][iCol * 2 - 2] === '*' ? 8 : 0) : 0;
                
                        tiles.draw(ctxt, tileRow, this.tileTypeIndices[type], x, y);  
                    }
                    break;

                    case '.': {
                        coinPos.row = iRow;
                        coinPos.col = iCol;
                        this.drawFloor(ctxt, tiles, floorRow, floorCol, x, y);
                        jb.messages.broadcast("spawnCoin", coinPos);
                    }
                    break;

                    case ',': {
                        this.drawFloor(ctxt, tiles, floorRow, floorCol, x, y);  
                    }
                    break;

                    case 'd': {
                        this.drawFloor(ctxt, tiles, floorRow, floorCol, x, y);  
                        tiles.draw(ctxt, doorRow, doorCol, x, y);  
                    }
                    break;

                    case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': {
                        this.monsterStart.push({x: Math.round((origin.x + x) / scale), y: Math.round((origin.y + y) / scale)});
                        tiles.draw(ctxt, floorRow, floorCol, x, y);  
                        if (this.map[iRow][iCol * 2 + 1] === '.') {
                            coinPos.row = iRow;
                            coinPos.col = iCol;
                            jb.messages.broadcast("spawnCoin", coinPos);
                        }
                    }
                    break;

                    case 'g': {
                        this.monsterGoals.push({x: Math.round((origin.x + x)), y: Math.round((origin.y + y))});
                        coinPos.row = iRow;
                        coinPos.col = iCol;
                        this.drawFloor(ctxt, tiles, floorRow, floorCol, x, y);  
                        jb.messages.broadcast("spawnCoin", coinPos);
                    }
                    break;

                    case 's': {
                        this.start.x = Math.round((origin.x + x) / scale);
                        this.start.y = Math.round((origin.y + y) / scale);
                        this.drawFloor(ctxt, tiles, floorRow, floorCol, x, y);  
                    }
                    break;

                    case 't': {
                        this.teleporters.push({row: iRow, col: iCol, x: this.xFromCol(iCol) / this.scale, y: this.yFromRow(iRow) / this.scale, linked: parseInt(this.map[iRow][2 * iCol + 1]) - 1});
                        coinPos.row = iRow;
                        coinPos.col = iCol;
                        this.drawFloor(ctxt, tiles, floorRow, floorCol, x, y);  
                        jb.messages.broadcast("spawnCoin", coinPos);
                    }
                    break;

                    case 'P': {
                        powerupInfo.row = iRow;
                        powerupInfo.col = iCol;
                        this.drawFloor(ctxt, tiles, floorRow, floorCol, x, y);  
                        jb.messages.broadcast("spawnPowerup", powerupInfo);
                    }
                    break;
                }
            }
        }
    },

    getTeleporterAt: function(x, y) {
        var row = this.rowFromY(y);
        var col = this.colFromX(x);
        var teleporter = null;

        if (this.isCellTeleporter(row, col)) {
            teleporter = this.getTeleporterLinkedTo(row, col);
        }

        return teleporter;
    },

    getPostTeleportGoal(bounds, moveDir, goalOut) {
        var row = this.rowFromY(bounds.t);
        var col = this.colFromX(bounds.l);

        switch(moveDir) {
            case "up": {
                row -= 1;
            }
            break;

            case "right": {
                col += 1;
            }
            break;

            case "down": {
                row += 1;
            }
            break;

            case "left": {
                col -= 1;
            }
            break;

            jb.assert(this.isInBounds(row, col) && this.isCellClear(row, col), "Invalid teleport location!");
            // Heading doesn't change.
        }

        goalOut.teleportTo = null;
        goalOut.x = this.xFromCol(col);
        goalOut.y = this.yFromRow(row);
    },

    isInBounds: function(row, col) {
        return row >= 0 && row < this.map.length && col >= 0 && col < this.map[row].length / 2;
    },

    getTeleporterLinkedTo(row, col) {
        var other = null;

        for (var i=0; i<this.teleporters.length; ++i) {
            if (this.teleporters[i].row === row && this.teleporters[i].col === col) {
                jb.assert(this.teleporters[i].linked < this.teleporters.length, "Invalid linked teleporter!");
                other = this.teleporters[this.teleporters[i].linked];
            }
        }

        jb.assert(other !== null, "No linked teleporter found!");

        return other;
    },

    draw: function(ctxt) {
        console.log("MMDEBUG <A>");
        ctxt.save();
        console.log("MMDEBUG <B>");
        ctxt.translate(this.origin.x, this.origin.y);
        console.log("MMDEBUG <C>");
        console.log("Canvas: " + this.canvas);
        ctxt.drawImage(this.canvas, 0, 0);
        console.log("MMDEBUG <D>");
        ctxt.restore();
        console.log("MMDEBUG <E>");
    },

    debugPoint: function(x, y, color) {
        // var ctxt = jb.ctxt;
        // var dx = this.origin.x;
        // var dy = this.origin.y;

        var ctxt = this.canvas.getContext('2d');
        var dx = 0;
        var dy = 0;

        ctxt.fillStyle = color;
        ctxt.fillRect(x - dx - 2, y - dy - 2, 4, 4);
    },

    debugCell: function(row, col, color) {
        // var ctxt = jb.ctxt;
        // var dx = 0;
        // var dy = 0;

        var ctxt = this.canvas.getContext('2d');
        var dx = this.origin.x;
        var dy = this.origin.y;

        ctxt.strokeStyle = color;
        ctxt.strokeWidth = 2;
        ctxt.beginPath();
        ctxt.rect(this.xFromCol(col) - dx, this.yFromRow(row) - dy, this.tileSize * this.scale, this.tileSize * this.scale);
        ctxt.closePath();
        ctxt.stroke();
    },

    turnMatrix: {
        up: {
            l: {dx: -1, dy: 0},
            r: {dx: 1, dy: 0},
        },
        right: {
            l: {dx: 0, dy: -1},
            r: {dx: 0, dy: 1},
        },
        down: {
            l: {dx: 1, dy: 0},
            r: {dx: -1, dy: 0},
        },
        left: {
            l: {dx: 0, dy: 1},
            r: {dx: 0, dy: -1},
        },
    },

    isCellClear: function(row, col) {
        // ###
        jb.assert(this.map[row], "Invalid row!");
        var cell = this.map[row][2 * col];

        return cell !== '*' && cell !== 'd';
    },

    isCellTeleporter: function(row, col) {
        var isTeleporter = false;

        if (this.isInBounds(row, col)) {
            isTeleporter = this.map[row][2 * col] === 't';
        }

        return isTeleporter;
    },

    getHuntGoal: function(bounds, moveDir, turn, goalOut, finalAttempt) {
        var startRow = this.rowFromY(bounds.t + bounds.halfHeight);
        var startCol = this.colFromX(bounds.l + bounds.halfWidth);
        var foundGoal = false;
        var turns = [];

        jb.assert(this.isInBounds(startRow, startCol), "Hunter out of bounds!");

        goalOut.teleportTo = null;

        if (turn === 's') {
            // This monster wants to go straight until it hits a wall.
            switch(moveDir) {
                case "up": {
                    for (var i=startRow - 1; i>=0; --i) {
                        if (this.isCellTeleporter(i, startCol)) {
                            foundGoal = true;
                            goalOut.x = this.xFromCol(startCol);
                            goalOut.y = this.yFromRow(i);
                            goalOut.teleportTo = this.getTeleporterLinkedTo(i, startCol);
                            // Heading doesn't change.
                            break;
                        }
                        else if (!this.isCellClear(i, startCol)) {
                            // Look for left or right turn.
                            foundGoal = true;
                            if (this.isCellClear(i + 1, startCol - 1)) turns.push(-1);
                            if (this.isCellClear(i + 1, startCol + 1)) turns.push(+1);

                            goalOut.x = this.xFromCol(startCol);
                            goalOut.y = this.yFromRow(i + 1);

                            if (turns.length === 0) {
                                // Blocked! Reverse direction.
                                goalOut.newHeading = "down";
                            }
                            else if (turns[Math.floor(Math.random() * turns.length)] < 0) {
                                goalOut.newHeading = "left";
                            }
                            else {
                                goalOut.newHeading = "right";
                            }
                            break;
                        }
                    }
                }
                break;

                case "right": {
                    for (var i=startCol + 1; i<this.map[startCol].length; ++i) {
                        if (this.isCellTeleporter(startRow, i)) {
                            foundGoal = true;
                            goalOut.x = this.xFromCol(i);
                            goalOut.y = this.yFromRow(startRow);
                            goalOut.teleportTo = this.getTeleporterLinkedTo(startRow, i);
                            // Heading doesn't change.
                            break;

                        }
                        else if (!this.isCellClear(startRow, i)) {
                            // Look for left or right turn.
                            foundGoal = true;
                            if (this.isCellClear(startRow - 1, i - 1)) turns.push(-1);
                            if (this.isCellClear(startRow + 1, i - 1)) turns.push(+1);

                            goalOut.x = this.xFromCol(i - 1);
                            goalOut.y = this.yFromRow(startRow);

                            if (turns.length === 0) {
                                // Blocked! Reverse direction.
                                goalOut.newHeading = "left";
                            }
                            else if (turns[Math.floor(Math.random() * turns.length)] < 0) {
                                goalOut.newHeading = "up";
                            }
                            else {
                                goalOut.newHeading = "down";
                            }
                            break;
                        }
                    }
                }
                break;

                case "down": {
                    for (var i=startRow + 1; i<this.map.length; ++i) {
                        if (this.isCellTeleporter(i, startCol)) {
                            foundGoal = true;
                            goalOut.x = this.xFromCol(startCol);
                            goalOut.y = this.yFromRow(i);
                            goalOut.teleportTo = this.getTeleporterLinkedTo(i, startCol);
                            // Heading doesn't change.
                            break;
                        }
                        else if (!this.isCellClear(i, startCol)) {
                            // Look for left or right turn.
                            foundGoal = true;
                            if (this.isCellClear(i - 1, startCol - 1)) turns.push(-1);
                            if (this.isCellClear(i - 1, startCol + 1)) turns.push(+1);

                            goalOut.x = this.xFromCol(startCol);
                            goalOut.y = this.yFromRow(i - 1);

                            if (turns.length === 0) {
                                // Blocked! Reverse direction.
                                goalOut.newHeading = "up";
                            }
                            else if (turns[Math.floor(Math.random() * turns.length)] < 0) {
                                goalOut.newHeading = "left";
                            }
                            else {
                                goalOut.newHeading = "right";
                            }
                            break;
                        }
                    }
                }
                break;

                case "left": {
                    for (var i=startCol - 1; i>=0; --i) {
                        if (this.isCellTeleporter(startRow, i)) {
                            foundGoal = true;
                            goalOut.x = this.xFromCol(i);
                            goalOut.y = this.yFromRow(startRow);
                            goalOut.teleportTo = this.getTeleporterLinkedTo(startRow, i);
                            // Heading doesn't change.
                            break;
                        }
                        else if (!this.isCellClear(startRow, i)) {
                            // Look for left or right turn.
                            foundGoal = true;
                            if (this.isCellClear(startRow - 1, i + 1)) turns.push(-1);
                            if (this.isCellClear(startRow + 1, i + 1)) turns.push(+1);

                            goalOut.x = this.xFromCol(i + 1);
                            goalOut.y = this.yFromRow(startRow);

                            if (turns.length === 0) {
                                // Blocked! Reverse direction.
                                goalOut.newHeading = "right";
                            }
                            else if (turns[Math.floor(Math.random() * turns.length)] < 0) {
                                goalOut.newHeading = "up";
                            }
                            else {
                                goalOut.newHeading = "down";
                            }
                            break;
                        }
                    }
                }
                break;
            }
        }
        else {
            switch(moveDir) {
                case "up": {
                    var offset = this.isCellClear(startRow - 1, startCol) ? -1 : 0;

                    for (var i=startRow + offset; i >= 0; --i) {
                        if (this.isCellClear(i, startCol)) {
                            var dx = this.turnMatrix[moveDir][turn].dx;
                            var dy = this.turnMatrix[moveDir][turn].dy;
        
                            var row = i + dy;
                            var col = startCol + dx;
        
                            if (this.isCellTeleporter(i, startCol)) {
                                // Moved straight into a teleporter.
                                foundGoal = true;
                                goalOut.y = this.yFromRow(i);
                                goalOut.x = this.xFromCol(startCol);
                                goalOut.teleportTo = this.getTeleporterLinkedTo(i, startCol);
                                // Heading doesn't change.
                                break;
                            }
                            else if (this.isCellClear(row, col)) {
                                foundGoal = true;
                                goalOut.x = this.xFromCol(startCol);
                                goalOut.y = this.yFromRow(row);
                                goalOut.newHeading = turn === 'l' ? "left" : "right";
                                break;
                            }
                            else if (finalAttempt && this.isCellClear(i, startCol)) {
                                // Blocked! Reverse direction.
                                foundGoal = true;
                                goalOut.x = this.xFromCol(startCol);
                                goalOut.y = this.yFromRow(i);
                                goalOut.newHeading = "down";
                                // Don't break. Continue to accept goals further away.
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
                break;

                case "right": {
                    var offset = this.isCellClear(startRow, startCol + 1) ? 1 : 0;

                    for (var i=startCol + offset; i < this.map.length; ++i) {
                        if (this.isCellClear(startRow, i)) {
                            var dx = this.turnMatrix[moveDir][turn].dx;
                            var dy = this.turnMatrix[moveDir][turn].dy;
        
                            var row = startRow + dy;
                            var col = i + dx;
        
                            if (this.isCellTeleporter(startRow, i)) {
                                // Moved straight into a teleporter.
                                foundGoal = true;
                                goalOut.y = this.yFromRow(startRow);
                                goalOut.x = this.xFromCol(i);
                                goalOut.teleportTo = this.getTeleporterLinkedTo(startRow, i);
                                // Heading doesn't change.
                                break;
                            }
                            else if (this.isCellClear(row, col)) {
                                foundGoal = true;
                                goalOut.x = this.xFromCol(col);
                                goalOut.y = this.yFromRow(startRow);
                                goalOut.newHeading = turn === 'l' ? "up" : "down";
                                break;
                            }
                            else if (finalAttempt && this.isCellClear(startRow, i)) {
                                // Blocked! Reverse direction.
                                foundGoal = true;
                                goalOut.x = this.xFromCol(i);
                                goalOut.y = this.yFromRow(startRow);
                                goalOut.newHeading = "left";
                                // Don't break. Continue to accept goals further away.
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
                break;

                case "down": {
                    var offset = this.isCellClear(startRow + 1, startCol) ? 1 : 0;

                    for (var i=startRow + offset; i < this.map[startCol].length; ++i) {
                        if (this.isCellClear(i, startCol)) {
                            var dx = this.turnMatrix[moveDir][turn].dx;
                            var dy = this.turnMatrix[moveDir][turn].dy;
        
                            var row = i + dy;
                            var col = startCol + dx;
        
                            if (this.isCellTeleporter(i, startCol)) {
                                // Moved straight into a teleporter.
                                foundGoal = true;
                                goalOut.y = this.yFromRow(i);
                                goalOut.x = this.xFromCol(startCol);
                                goalOut.teleportTo = this.getTeleporterLinkedTo(i, startCol);
                                // Heading doesn't change.
                                break;
                            }
                            else if (this.isCellClear(row, col)) {
                                foundGoal = true;
                                goalOut.x = this.xFromCol(startCol);
                                goalOut.y = this.yFromRow(row);
                                goalOut.newHeading = turn === 'l' ? "right" : "left";
                                break;
                            }
                            else if (finalAttempt && this.isCellClear(i, startCol)) {
                                // Blocked! Reverse direction.
                                foundGoal = true;
                                goalOut.x = this.xFromCol(startCol);
                                goalOut.y = this.yFromRow(i);
                                goalOut.newHeading = "up";
                                // Don't break. Continue to accept goals further away.
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
                break;

                case "left": {
                    var offset = this.isCellClear(startRow, startCol - 1) ? -1 : 0;

                    for (var i=startCol + offset; i >= 0; --i) {
                        if (this.isCellClear(startRow, i)) {
                            var dx = this.turnMatrix[moveDir][turn].dx;
                            var dy = this.turnMatrix[moveDir][turn].dy;
        
                            var row = startRow + dy;
                            var col = i + dx;
        
                            if (this.isCellTeleporter(startRow, i)) {
                                // Moved straight into a teleporter.
                                foundGoal = true;
                                goalOut.y = this.yFromRow(startRow);
                                goalOut.x = this.xFromCol(i);
                                goalOut.teleportTo = this.getTeleporterLinkedTo(startRow, i);
                                // Heading doesn't change.
                                break;
                            }
                            else if (this.isCellClear(row, col)) {
                                foundGoal = true;
                                goalOut.x = this.xFromCol(col);
                                goalOut.y = this.yFromRow(startRow);
                                goalOut.newHeading = turn === 'l' ? "down" : "up";
                                break;
                            }
                            else if (finalAttempt && this.isCellClear(startRow, i)) {
                                // Blocked! Reverse direction.
                                foundGoal = true;
                                goalOut.x = this.xFromCol(i);
                                goalOut.y = this.yFromRow(startRow);
                                goalOut.newHeading = "right";
                                // Don't break. Continue to accept goals further away.
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
                break;
            }
        }

        if (!foundGoal && turn === 's') {
            // Should never get here.
            jb.assert(false, "Illegal goal state!");
        }
        else if (!foundGoal) {
            jb.assert(!finalAttempt, "Failed to find hunt goal!");

            // Reverse direction and try again.
            turn = turn === "l" ? "r" : "l";
            this.getHuntGoal(bounds, moveDir, turn, goalOut, true);
        }
        else {
            var dirCheck  ={
                up: {dx: 0, dy: -1},
                right: {dx: 1, dy: 0},
                down: {dx: 0, dy: 1,},
                left: {dx: -1, dy: 0}
            };

            var dx = goalOut.x - bounds.l;
            var dy = goalOut.y - bounds.t;

            var r = this.rowFromY(goalOut.y);
            var c = this.colFromX(goalOut.x);

            jb.assert(this.isCellTeleporter(r, c) || this.isInBounds(r + 1, c), "Goal out of bounds!");
            jb.assert(this.isCellTeleporter(r, c) || this.isInBounds(r, c + 1), "Goal out of bounds!");
            jb.assert(this.isCellTeleporter(r, c) || this.isInBounds(r - 1, c), "Goal out of bounds!");
            jb.assert(this.isCellTeleporter(r, c) || this.isInBounds(r, c - 1), "Goal out of bounds!");

            jb.assert(dirCheck[moveDir].dx * dx >= 0 && dirCheck[moveDir].dy * dy >= 0, "Already past goal!");
        }

        return foundGoal;
    },

    getPlayerGoal: function(bounds, moveDir, goalOut) {
        var startRow = this.rowFromY(bounds.t + bounds.halfHeight);
        var startCol = this.colFromX(bounds.l + bounds.halfWidth);
        var foundGoal = false;
        var turns = [];
        goalOut.teleportTo = null;

        // This monster wants to go straight until it hits a wall.
        switch(moveDir) {
            case "up": {
                for (var i=startRow - 1; i>=0; --i) {
                    if (this.isCellTeleporter(i, startCol)) {
                        foundGoal = true;
                        goalOut.x = this.xFromCol(startCol);
                        goalOut.y = this.yFromRow(i);
                        goalOut.teleportTo = this.getTeleporterLinkedTo(i, startCol);
                        // Heading doesn't change.
                        break;
                    }
                    else if (!this.isCellClear(i, startCol)) {
                        var goalX = this.xFromCol(startCol);
                        var goalY = this.yFromRow(i + 1);

                        if (i + 1 !== startRow) {
                            goalOut.x = goalX;
                            goalOut.y = goalY;
                            foundGoal = true;
                        }
                        else {
                            goalOut.x = bounds.l;
                            goalOut.y = goalY;
                        }

                        break;
                    }
                }
            }
            break;

            case "right": {
                for (var i=startCol + 1; i<this.map[startCol].length; ++i) {
                    if (this.isCellTeleporter(startRow, i)) {
                        foundGoal = true;
                        goalOut.x = this.xFromCol(i);
                        goalOut.y = this.yFromRow(startRow);
                        goalOut.teleportTo = this.getTeleporterLinkedTo(startRow, i);
                        // Heading doesn't change.
                        break;

                    }
                    else if (!this.isCellClear(startRow, i)) {
                        var goalX = this.xFromCol(i - 1);
                        var goalY = this.yFromRow(startRow);

                        if (i - 1 !== startCol) {
                            goalOut.x = goalX;
                            goalOut.y = goalY;
                            foundGoal = true;
                        }
                        else {
                            goalOut.x = goalX;
                            goalOut.y = bounds.t;
                        }

                        break;
                    }
                }
            }
            break;

            case "down": {
                for (var i=startRow + 1; i<this.map.length; ++i) {
                    if (this.isCellTeleporter(i, startCol)) {
                        foundGoal = true;
                        goalOut.x = this.xFromCol(startCol);
                        goalOut.y = this.yFromRow(i);
                        goalOut.teleportTo = this.getTeleporterLinkedTo(i, startCol);
                        // Heading doesn't change.
                        break;
                    }
                    else if (!this.isCellClear(i, startCol)) {
                        var goalX = this.xFromCol(startCol);
                        var goalY = this.yFromRow(i - 1);

                        if (i - 1 !== startRow) {
                            goalOut.x = goalX;
                            goalOut.y = goalY;
                            foundGoal = true;
                        }
                        else {
                            goalOut.x = bounds.l;
                            goalOut.y = goalY;
                        }

                        break;
                    }
                }
            }
            break;

            case "left": {
                for (var i=startCol - 1; i>=0; --i) {
                    if (this.isCellTeleporter(startRow, i)) {
                        foundGoal = true;
                        goalOut.x = this.xFromCol(i);
                        goalOut.y = this.yFromRow(startRow);
                        goalOut.teleportTo = this.getTeleporterLinkedTo(startRow, i);
                        // Heading doesn't change.
                        break;
                    }
                    else if (!this.isCellClear(startRow, i)) {
                        var goalX = this.xFromCol(i + 1);
                        var goalY = this.yFromRow(startRow);

                        if (i + 1 !== startCol) {
                            goalOut.x = goalX;
                            goalOut.y = goalY;
                            foundGoal = true;
                        }
                        else {
                            goalOut.x = goalX;
                            goalOut.y = bounds.t;
                        }

                        break;
                    }
                }
            }
            break;
        }

        return foundGoal;
    },
};

