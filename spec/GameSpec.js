(function () {
    "use strict";

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

            turn(playerX, [0, col], "");
            turn(playerO, [0, (col + 1) % 3], "");
            turn(playerX, [1, col], "");
            turn(playerO, [1, (col + 1) % 3], "");
            turn(playerX, [2, col], "X");
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

            turn(playerX, [0, (col + 1) % 3], "");
            turn(playerO, [0, col], "");
            turn(playerX, [0, (col + 2) % 3], "");
            turn(playerO, [1, col], "");
            turn(playerX, [2, (col + 1) % 3], "");
            turn(playerO, [2, col], "O");
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

            turn(playerX, [row, 0], "");
            turn(playerO, [(row + 1) % 3, 0], "");
            turn(playerX, [row, 1], "");
            turn(playerO, [(row + 2) % 3, 0], "");
            turn(playerX, [row, 2], "X");
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

            turn(playerX, [(row + 1) % 3, 0], "");
            turn(playerO, [row, 0], "");
            turn(playerX, [(row + 1) % 3, 1], "");
            turn(playerO, [row, 1], "");
            turn(playerX, [(row + 2) % 3, 0], "");
            turn(playerO, [row, 2], "O");
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

        it("is a win for player X when main diagonal is occupied by X", function () {
            turn(playerX, [0, 0], "");
            turn(playerO, [1, 0], "");
            turn(playerX, [1, 1], "");
            turn(playerO, [2, 0], "");
            turn(playerX, [2, 2], "X");
        });

        it("is a win for player O when main diagonal is occupied by O", function () {
            turn(playerX, [1, 0], "");
            turn(playerO, [0, 0], "");
            turn(playerX, [2, 0], "");
            turn(playerO, [1, 1], "");
            turn(playerX, [2, 1], "");
            turn(playerO, [2, 2], "O");
        });

        it("is a win for player X when back diagonal is occupied by X", function () {
            turn(playerX, [0, 2], "");
            turn(playerO, [0, 0], "");
            turn(playerX, [1, 1], "");
            turn(playerO, [2, 1], "");
            turn(playerX, [2, 0], "X");
        });

        it("is a win for player O when back diagonal is occupied by O", function () {
            turn(playerX, [0, 0], "");
            turn(playerO, [0, 2], "");
            turn(playerX, [1, 0], "");
            turn(playerO, [1, 1], "");
            turn(playerX, [2, 1], "");
            turn(playerO, [2, 0], "O");
        });

        it("is stopped when somebody has won", function () {
            turn(playerX, [0, 2], "");
            turn(playerO, [0, 0], "");
            turn(playerX, [1, 1], "");
            turn(playerO, [2, 1], "");
            turn(playerX, [2, 0], "X");

            expect(function () {
                turn(playerO, [1, 0], "X");
            }).toThrow(new Error("The game is over! You can't make a turn."));
        });



        function turn(player, turn, expectedWinner) {
            player.futureTurn = turn;
            game.update();
            expect(game.winner()).toEqual(expectedWinner);
        }
    });

    function FakePlayer(sign) {
        this.sign = sign;
        this.futureTurn = [0, 0];
    }

    FakePlayer.prototype.makeTurn = function (callback) {
        callback(this.futureTurn[0], this.futureTurn[1], this.sign);
    };

    FakePlayer.prototype.getSign = function () {
        return this.sign;
    }
})();