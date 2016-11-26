var turnCallback = function () {
};

function Player(sign) {
    this.sign = sign;
}

Player.prototype.makeTurn = function (callback) {
    var me = this;
    turnCallback = function (row, col) {
        callback(row, col, me.getSign());
    };
};

Player.prototype.getSign = function () {
    return this.sign;
};

var player = new Player("X");
var computer = new Player("O");
var game = new Game(player, computer);

$(".cell_board").click(function () {
    var $cell = $(this);

    var row = $cell.attr("row");
    var col = $cell.attr("col");

    turnCallback(row, col);

    $cell.text(game.getCell(row, col));

    if (game.winner() !== "")
        alert("Winner: " + game.winner());

    game.update();
});

game.update();