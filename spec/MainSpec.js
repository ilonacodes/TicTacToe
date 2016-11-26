(function () {
    "use strict";

    var fakeQuery;

    window.$ = function (query) {
        if (query instanceof FakeElement)
            return query;

        fakeQuery.query = query;
        return fakeQuery;
    };

    describe("Main", function () {
        var main;

        beforeEach(function () {
            fakeQuery = new FakeQuery("_");
            main = new Main();
        });

        it("creates 2 players: player and computer", function () {
            expect(main.player instanceof Player).toEqual(true);
            expect(main.computer instanceof Player).toEqual(true);
        });

        it("creates the Game", function () {
            expect(main.game instanceof Game).toEqual(true);
        });

        it("reacts to user click on board cell", function () {
            var cell = new FakeElement({row: 0, col: 0});
            expect(fakeQuery.query).toEqual(".cell_board");
            fakeQuery.callback.call(cell);
            expect(main.game.getCell(0, 0)).toEqual("X");
        });

        it("reacts to user click on different board cell", function () {
            var cell = new FakeElement({row: 1, col: 2});
            expect(fakeQuery.query).toEqual(".cell_board");
            fakeQuery.callback.call(cell);
            expect(main.game.getCell(1, 2)).toEqual("X");
        });

        it("reacts to two users clicks on different cells", function () {
            fakeQuery.callback.call(new FakeElement({row: 0, col: 0}));
            fakeQuery.callback.call(new FakeElement({row: 1, col: 2}));
            expect(main.game.getCell(1, 2)).toEqual("O");
        });

        it("renders X to the cell", function () {
            var cell = new FakeElement({row: 1, col: 2});
            fakeQuery.callback.call(cell);
            expect(cell.value).toEqual("X");
        });

        it("renders O to the cell", function () {
            var cell = new FakeElement({row: 1, col: 2});
            fakeQuery.callback.call(new FakeElement({row: 2, col: 0}));
            fakeQuery.callback.call(cell);
            expect(cell.value).toEqual("O");
        });

        it("shows player won alert", function () {
            fakeQuery.callback.call(new FakeElement({row: 0, col: 0}));
            fakeQuery.callback.call(new FakeElement({row: 2, col: 0}));
            fakeQuery.callback.call(new FakeElement({row: 0, col: 1}));
            fakeQuery.callback.call(new FakeElement({row: 1, col: 0}));
            fakeQuery.callback.call(new FakeElement({row: 0, col: 2}));
            expect(fakeQuery.query).toEqual("#player_won_alert");
            expect(fakeQuery.removedClass).toEqual("hidden");
        });

        it("does not show any won alert when game is in progress", function () {
            fakeQuery.callback.call(new FakeElement({row: 0, col: 0}));
            expect(fakeQuery.removedClass).toEqual(undefined);
        });

        it("shows computer won alert", function () {
            fakeQuery.callback.call(new FakeElement({row: 1, col: 0}));
            fakeQuery.callback.call(new FakeElement({row: 0, col: 0}));
            fakeQuery.callback.call(new FakeElement({row: 0, col: 1}));
            fakeQuery.callback.call(new FakeElement({row: 1, col: 1}));
            fakeQuery.callback.call(new FakeElement({row: 0, col: 2}));
            fakeQuery.callback.call(new FakeElement({row: 2, col: 2}));
            expect(fakeQuery.query).toEqual("#computer_won_alert");
            expect(fakeQuery.removedClass).toEqual("hidden");
        });
    });

    function FakeQuery(query) {
        this.query = query;
    }

    FakeQuery.prototype.click = function (callback) {
        this.callback = callback;
    };

    FakeQuery.prototype.removeClass = function (className) {
        this.removedClass = className;
    };

    function FakeElement(attrs) {
        this.attrs = attrs;
    }

    FakeElement.prototype.attr = function (name) {
        return this.attrs[name];
    };

    FakeElement.prototype.text = function (value) {
        this.value = value;
    };

})();