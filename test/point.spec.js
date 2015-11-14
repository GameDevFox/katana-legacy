var expect = require("chai").expect;

var point = require("katana/point");

describe("katana/point", function() {

	describe("buildPoint(val)", function() {
		it("should set and get value", function() {
			var p = point.buildPoint(13);
			expect(p()).to.equal(13);
			p(7);
			expect(p()).to.equal(7);
		});
	});

	describe("buildGroup(val)", function() {
		it("should set and get values of group (object or array)", function() {
			var g = point.buildGroup({
				name: "James",
				age: 21
			});
			expect(g()).to.deep.equal({ name: "James", age: 21 });

			g("name", "Ceasar");
			expect(g()).to.deep.equal({ name: "Ceasar", age: 21 });

			g("age", 18);
			g("gold", 100);
			expect(g()).to.deep.equal({ name: "Ceasar", age: 18, gold: 100 });

			expect(g("age")).to.equal(18);
		});
	});
});
