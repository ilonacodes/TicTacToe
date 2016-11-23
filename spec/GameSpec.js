(function () {
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

    Game.prototype.winner = function () {
        if (this.winnerByCol(0, "X") ||
            this.winnerByCol(1, "X") ||
            this.winnerByCol(2, "X")) {
            return "X";
        }

        if (this.winnerByCol(0, "O") ||
            this.winnerByCol(1, "O") ||
            this.winnerByCol(2, "O")) {
            return "O";
        }

        if (this.winnerByRow(0, "X") ||
            this.winnerByRow(1, "X") ||
            this.winnerByRow(2, "X")) {
            return "X";
        }

        if (this.winnerByRow(0, "O") ||
            this.winnerByRow(1, "O") ||
            this.winnerByRow(2, "O")) {
            return "O";
        }

        return "";
    };

    describe("Game", function () {
        var playerX, playerO, game;

        beforeEach(function () {
            playerX = new FakePlayer("X");
            playerO = new FakePlayer("O");
            game = new Game(playerX, playerO);
        });

        it("lets player X to make a turn first", function () {
            game.update();

            expect(game.getCell(0, 0)).toEqual("X");
            expect(game.getCell(1, 2)).toEqual("");
        });

        it("lets player X to make a turn at different position", function () {
            playerX.futureTurn = [1, 2];

            game.update();

            expect(game.getCell(0, 0)).toEqual("");
            expect(game.getCell(1, 2)).toEqual("X");
        });

        it("lets player O to make a second turn", function () {
            playerO.futureTurn = [1, 2];

            game.update();
            game.update();

            expect(game.getCell(0, 0)).toEqual("X");
            expect(game.getCell(1, 2)).toEqual("O");
        });

        it("lets player X to make a third turn", function () {
            playerO.futureTurn = [1, 2];

            game.update();
            game.update();

            playerX.futureTurn = [2, 1];
            game.update();

            expect(game.getCell(0, 0)).toEqual("X");
            expect(game.getCell(1, 2)).toEqual("O");
            expect(game.getCell(2, 1)).toEqual("X");
        });

        it("doesn't let player O to make a turn within occupied cell", function () {
            game.update();

            expect(function () {
                game.update();
            }).toThrow(new Error("This cell is occupied. Try again!"));
        });

        function columnWinnerXScenario(col) {
            expect(game.winner()).toEqual("");

            playerX.futureTurn = [0, col];
            game.update();
            expect(game.winner()).toEqual("");

            playerO.futureTurn = [0, (col + 1) % 3];
            game.update();

            playerX.futureTurn = [1, col];
            game.update();
            expect(game.winner()).toEqual("");

            playerO.futureTurn = [1, (col + 1) % 3];
            game.update();

            playerX.futureTurn = [2, col];
            game.update();
            expect(game.winner()).toEqual("X");
        }

        it("is a win for player X when first column is occupied by X", function () {
            columnWinnerXScenario(0);
        });

        it("is a win for player X when second column is occupied by X", function () {
            columnWinnerXScenario(1);
        });

        it("is a win for player X when third column is occupied by X", function () {
            columnWinnerXScenario(2);
        });

        function columnWinnerOScenario(col) {
            expect(game.winner()).toEqual("");

            playerX.futureTurn = [0, (col + 1) % 3];
            game.update();
            expect(game.winner()).toEqual("");

            playerO.futureTurn = [0, col];
            game.update();
            expect(game.winner()).toEqual("");

            playerX.futureTurn = [0, (col + 2) % 3];
            game.update();
            expect(game.winner()).toEqual("");

            playerO.futureTurn = [1, col];
            game.update();
            expect(game.winner()).toEqual("");

            playerX.futureTurn = [2, (col + 1) % 3];
            game.update();
            expect(game.winner()).toEqual("");

            playerO.futureTurn = [2, col];
            game.update();
            expect(game.winner()).toEqual("O");
        }

        it("is a win for player O when first column is occupied by O", function () {
            columnWinnerOScenario(0);
        });

        it("is a win for player O when second column is occupied by O", function () {
            columnWinnerOScenario(1);
        });

        it("is a win for player O when third column is occupied by O", function () {
            columnWinnerOScenario(2);
        });

        function rowWinnerXScenario(row) {
            expect(game.winner()).toEqual("");

            playerX.futureTurn = [row, 0];
            game.update();
            expect(game.winner()).toEqual("");

            playerO.futureTurn = [(row + 1) % 3, 0];
            game.update();
            expect(game.winner()).toEqual("");

            playerX.futureTurn = [row, 1];
            game.update();
            expect(game.winner()).toEqual("");

            playerO.futureTurn = [(row + 2) % 3, 0];
            game.update();
            expect(game.winner()).toEqual("");

            playerX.futureTurn = [row, 2];
            game.update();
            expect(game.winner()).toEqual("X");
        }

        it("is a win for player X when first row is occupied by X", function () {
            rowWinnerXScenario(0);
        });

        it("is a win for player X when second row is occupied by X", function () {
            rowWinnerXScenario(1);
        });

        it("is a win for player X when third row is occupied by X", function () {
            rowWinnerXScenario(2);
        });

        function rowWinnerOScenario(row) {
            expect(game.winner()).toEqual("");

            playerX.futureTurn = [(row + 1) % 3, 0];
            game.update();
            expect(game.winner()).toEqual("");

            playerO.futureTurn = [row, 0];
            game.update();
            expect(game.winner()).toEqual("");

            playerX.futureTurn = [(row + 1) % 3, 1];
            game.update();
            expect(game.winner()).toEqual("");

            playerO.futureTurn = [row, 1];
            game.update();
            expect(game.winner()).toEqual("");

            playerX.futureTurn = [(row + 2) % 3, 0];
            game.update();
            expect(game.winner()).toEqual("");

            playerO.futureTurn = [row, 2];
            game.update();
            expect(game.winner()).toEqual("O");
        }

        it("is a win for player O when first row is occupied by O", function () {
            rowWinnerOScenario(0);
        });

        it("is a win for player O when second row is occupied by O", function () {
            rowWinnerOScenario(1);
        });

        it("is a win for player O when third row is occupied by O", function () {
            rowWinnerOScenario(2);
        });
    });

    function FakePlayer(sign) {
        this.sign = sign;
        this.futureTurn = [0, 0];
    }

    FakePlayer.prototype.makeTurn = function (callback) {
        callback(this.futureTurn[0], this.futureTurn[1], this.sign);
    };
})();