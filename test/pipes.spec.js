var expect = require("chai").expect;
var sinon = require("sinon");

var pipes = require("katana/pipes");

describe("katana/pipes", function() {

	describe("pipe()", function() {
		it("should pass data to output AS-IS", function() {
			var pipe = pipes.pipe();
			pipe.out(function(value) {
				expect(value).to.equal("Test Me!");
			});
			pipe("Test Me!");
		});
	});

	describe("valve(input, output)", function() {
		it("should only pass data (AS-IS) to output is the valve is open (true)", function() {

			var spy = sinon.spy();
			var pump = pipes.pump(sinon.stub().returns("Data!"));
			var openValve = pipes.valve(pump, spy);

			expect(spy.called).to.equal(false);

			pump(); // Pump while valve is closed - value is 1
			expect(spy.called).to.equal(false);

			openValve(true);
			pump(); // Pump while valve is open - value is 2
			expect(spy.calledOnce).to.equal(true);

			expect(spy.lastCall.args).to.deep.equal(["Data!"]);
		});
	});

	describe("plus(x)", function() {
		it("should increment input by x", function() {
			var spy = sinon.spy();
			var plus = pipes.plus(3);
			plus.out(spy);

			plus(1);
			expect(spy.lastCall.args).to.deep.equal([4]);
			plus(7);
			expect(spy.lastCall.args).to.deep.equal([10]);
		});
	});
});
