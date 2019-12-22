jb.bank = {
    coinObj: function(row, col) {
        this.row = row;
        this.col = col;
    },

    COIN_ROW: 5,
    COIN_COL: 17,
    scale: 1,
    cache: {},
    display: {},
    tileSheet: null,
    localScale: 0.5,
    count: 0,

    listen: function() {
        jb.messages.listen("spawnCoin", this);
        jb.messages.listen("spawnPowerup", this);
        jb.messages.listen("collectPowerup", this);
    },

    init: function(tileSheetIn, scale) {
        this.tileSheet = tileSheetIn;
        this.scale = scale;
        this.count = 0;
    },

    reset: function() {
        for (var key in this.display) {
            if (this.display[key]) {
                while (this.display[key].length > 0) {
                    this.cache[key].push(this.display[key].pop())
                }
            }
        }

        this.count = 0;
    },

    collide: function(row, col) {
        var key = "" + row;
        var coinsInRow = this.display[key];
        
        for (var i=0; coinsInRow && i<coinsInRow.length; ++i) {
            if (coinsInRow[i].row === row && coinsInRow[i].col === col) {
                this.collectCoin(coinsInRow[i]);
                break;
            }
        }
    },

    draw: function(ctxt, map) {
        for (var key in this.display) {
            for (var i=0; i<this.display[key].length; ++i) {
                var coin = this.display[key][i];
                var x = map.xFromColCenter(coin.col) - this.tileSheet.cellDx * 0.5 * this.localScale * this.scale;
                var y = map.yFromRowCenter(coin.row) - this.tileSheet.cellDy * 0.5 * this.localScale * this.scale;

                this.tileSheet.draw(ctxt, this.COIN_ROW, this.COIN_COL, x, y, 0, 0, this.localScale, this.localScale);
            }
        }
    },

    spawnPowerup: function() {
        this.count += 1;
    },

    collectPowerup: function() {
        this.removeCoin();
    },

    spawnCoin: function(pos) {
        var coin = null;
        var key = "" + pos.row;

        if (!this.cache[key]) {
            this.cache[key] = [];
        }

        if (this.cache[key].length > 0) {
            coin = this.cache[key].pop();
        }
        else {
            coin = new this.coinObj(pos.row, pos.col);
        }

        if (!this.display[key]) {
            this.display[key] = [];
        }

        this.count += 1;
        this.display[key].push(coin);

        return coin;
    },

    collectCoin: function(coin) {
        var key = "" + coin.row;

        jb.removeFromArray(this.display[key], coin, false);

        jb.assert(this.cache[key] !== null, "Invalid coin key!");
        this.cache[key].push(coin);

        jb.messages.broadcast("coinCollected", coin);

        this.removeCoin();
    },

    removeCoin: function() {
        this.count -= 1;
        if (this.count === 0) {
            jb.messages.broadcast("levelComplete");
        }
    }
};

jb.bank.listen();

