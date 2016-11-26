window.Game = (function () {
    "use strict";

    function Game(first, second) {
        this.first = first;
        this.second = second;

        this.field = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
    }

    Game.prototype.update = function () {
        var game = this;

        game.first.makeTurn(function (row, col, sign) {
            if (game.getCell(row, col) !== "") {
                throw new Error("This cell is occupied. Try again!");
            }

            game.field[row][col] = sign;

            game.swap();
        });
    };


    Game.prototype.getCell = function (row, col) {
        return this.field[row][col];
    };

    Game.prototype.swap = function () {
        var temp = this.first;
        this.first = this.second;
        this.second = temp;
    };

    Game.prototype.winnerByCol = function (col, sign) {
        return this.getCell(0, col) === sign &&
            this.getCell(1, col) === sign &&
            this.getCell(2, col) === sign;
    };

    Game.prototype.winnerByRow = function (row, sign) {
        return this.getCell(row, 0) === sign &&
            this.getCell(row, 1) === sign &&
            this.getCell(row, 2) === sign;
    };

    Game.prototype.winnerByMainDiagonal = function (sign) {
        return this.getCell(0, 0) === sign &&
            this.getCell(1, 1) === sign &&
            this.getCell(2, 2) === sign;
    };

    Game.prototype.winnerByBackDiagonal = function (sign) {
        return this.getCell(0, 2) === sign &&
            this.getCell(1, 1) === sign &&
            this.getCell(2, 0) === sign;
    };

    Game.prototype.winner = function () {
        var game = this;

        return [game.first, game.second].reduce(function (winner, player) {
            if (game.winnerByCol(0, player.getSign()) ||
                game.winnerByCol(1, player.getSign()) ||
                game.winnerByCol(2, player.getSign())) {
                return player.getSign();
            }

            if (game.winnerByRow(0, player.getSign()) ||
                game.winnerByRow(1, player.getSign()) ||
                game.winnerByRow(2, player.getSign())) {
                return player.getSign();
            }

            if (game.winnerByMainDiagonal(player.getSign()))
                return player.getSign();

            if (game.winnerByBackDiagonal(player.getSign()))
                return player.getSign();

            return winner;
        }, "");
    };

    return Game;
})();
