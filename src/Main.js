function Player(main, sign) {
    this.main = main;
    this.sign = sign;
}

Player.prototype.makeTurn = function (callback) {
    callback(this.main.clickedRow, this.main.clickedCol, this.sign);
};

Player.prototype.getSign = function () {
    return this.sign;
};

function Main() {
    var main = this;

    main.player = new Player(main, "X");
    main.computer = new Player(main, "O");
    main.game = new Game(main.player, main.computer);

    $(".cell_board").click(function () {
        main.clickedRow = $(this).attr("row");
        main.clickedCol = $(this).attr("col");
        main.game.update();
        $(this).text(main.game.getCell(main.clickedRow, main.clickedCol));

        if (main.game.winner() === "X")
            $("#player_won_alert").removeClass("hidden");
        else if (main.game.winner() === "O")
            $("#computer_won_alert").removeClass("hidden");
    });
}