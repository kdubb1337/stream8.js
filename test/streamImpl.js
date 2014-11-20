describe('A Stream', function () {
	it('can be averaged', function () {
		expect([].stream().average()).toBe(0);
		expect([undefined, NaN, null, 0].stream().average()).toBe(0);
		expect([1].stream().average()).toBe(1);
		expect([-5, 5].stream().average()).toBe(0);
		expect([1, 2, 3, 4, 5].stream().average()).toBe(3);
		expect([1, 2].stream().average()).toBe(1.5);

		expect(Stream.empty().average()).toBe(0);
		expect(Stream.range(0,1000).average()).toBe(500);
	});

	it('can be counted', function () {
		expect([].stream().count()).toBe(0);
		expect([1].stream().count()).toBe(1);
		expect([{}].stream().count()).toBe(1);
		expect(["c", "b", "c", "a"].stream().count()).toBe(4);
		expect([{name:"b"}, {name:"a"}].stream().count()).toBe(2);
		expect([undefined, undefined, NaN, NaN, null].stream().count()).toBe(5);
	});

	it('can be empty', function () {
		expect([undefined].stream().isEmpty()).toBe(false);
		expect([undefined].stream().tail().isEmpty()).toBe(true);
		expect([null].stream().isEmpty()).toBe(false);
		expect([null].stream().tail().isEmpty()).toBe(true);
		expect([NaN].stream().isEmpty()).toBe(false);
		expect(["a"].stream().isEmpty()).toBe(false);
		expect(["NaN"].stream().isEmpty()).toBe(false);
		expect(["a", "b", "c"].stream().isEmpty()).toBe(false);
		expect(["a", "b", "c"].stream().tail().isEmpty()).toBe(false);
		expect([{}].stream().isEmpty()).toBe(false);
		expect([{name:"b"}, {name:"a"}].stream().isEmpty()).toBe(false);
		expect([].stream().isEmpty()).toBe(true);
	});

	it('can filter elements', function () {
		var filtered = ["b", "c", "a", "c"].stream().filter(function(val) {
			return val != "c";
		});
		expect(filtered.count()).toBe(2);
		expect(filtered.toArray()).toEqual(["b", "a"]);

		filtered = Stream.empty().filter(function(val) {
			return val != "c";
		});
		expect(filtered.count()).toBe(0);
		expect(filtered.toArray()).toEqual([]);

		filtered = [{name:"bob"}, {name:"alice"}, {name:"vivian"},{firstName:"alice"}]
			.stream()
			.filter(function(val) {
				return val.name == "alice" || val.firstName == "alice";
			});
		expect(filtered.count()).toBe(2);
		expect(filtered.toArray()).toEqual([{name:"alice"}, {firstName:"alice"}]);

		filtered = Stream.range(100)
			.filter(function(val) {
				return val > 150;
			})
			.limit(100);
		expect(filtered.toArray()).toEqual(Stream.range(151, 250).toArray());
	});

	it('can run a function for each element', function () {
		var counter = 0;
		var lastElement;
		["a", "b", "c"].stream().forEach(function(val) {
			counter++;
			lastElement = val;
		});
		expect(counter).toBe(3);
		expect(lastElement).toBe("c");

		counter = 0;
		lastElement = "notThis!";
		[undefined].stream().forEach(function(val) {
			counter++;
			lastElement = val;
		});
		expect(counter).toBe(1);
		expect(lastElement).toBe(undefined);

		counter = 0;
		lastElement = "this!";
		[].stream().forEach(function(val) {
			counter++;
			lastElement = val;
		});
		expect(counter).toBe(0);
		expect(lastElement).toBe("this!");

		counter = 0;
		lastElement = "this!";
		Stream.empty().forEach(function(val) {
			counter++;
			lastElement = val;
		});
		expect(counter).toBe(0);
		expect(lastElement).toBe("this!");

		counter = 0;
		Stream.range().limit(1000).forEach(function(val) {
			counter++;
			lastElement = val;
		});
		expect(counter).toBe(1000);
		expect(lastElement).toBe(1000);
	});

	it('can limit', function() {
		expect([].stream().limit(0).count()).toBe(0);
		expect([].stream().limit(2).count()).toBe(0);
		expect([].stream().limit(2).isEmpty()).toBe(true);
		expect([undefined].stream().limit(2).count()).toBe(1);
		expect([undefined, undefined, undefined].stream().limit(2).count()).toBe(2);

		var simpleStream = [1, 2, 3, 4, 5].stream();
		expect(simpleStream.limit(2).count()).toBe(2);
		expect(simpleStream.limit(2).toArray()).toEqual([1, 2]);
		expect(simpleStream.limit(4).count()).toBe(4);
		expect(simpleStream.limit(4).limit(2).count()).toBe(2);
		expect(simpleStream.limit(2).limit(4).count()).toBe(2);

		expect(Stream.empty().limit(512).count()).toBe(0);
		expect(Stream.range(0, 100).limit(22).count()).toBe(22);
		expect(Stream.range(0, 100).limit(5).toArray()).toEqual([0, 1, 2, 3, 4]);
		expect(Stream.range().limit(512).count()).toBe(512);
	});

	it('can be made into an array', function () {
		expect([].stream().toArray()).toEqual([]);
		expect(["1", 1 , "a", undefined, "basdf"].stream().toArray())
			.toEqual(["1", 1 , "a", undefined, "basdf"]);
		expect([undefined].stream().toArray()).toEqual([undefined]);
		expect([undefined, undefined, NaN, null].stream().toArray())
			.toEqual([undefined, undefined, NaN, null]);

		expect(Stream.range(0, 5).toArray()).toEqual([0, 1, 2, 3, 4, 5]);
		expect(Stream.range(-2, -1).toArray()).toEqual([-2, -1]);
		expect(Stream.range(1, -1).toArray()).toEqual([]);
		expect(Stream.range(1).limit(5).toArray()).toEqual([1, 2, 3, 4, 5]);
	});

	it('can sum the elements', function () {
		expect([].stream().sum()).toBe(0);
		expect([-1, 1].stream().sum()).toBe(0);
		expect([1, 2, 3].stream().sum()).toBe(6);
		expect([3, -3, 100].stream().sum()).toBe(100);
		expect(Stream.empty().sum()).toBe(0);
		expect(Stream.range(0, 10).sum()).toBe(55);

		expect([undefined, NaN].stream().sum()).toBe(0);
		expect([5, undefined, 9995, 22].stream().sum()).toBe(10022);

		expect([{}, "a"].stream().sum()).toBe(0);
		expect([NaN, null, {}, 2, "a"].stream().sum()).toBe(2);
	});
});