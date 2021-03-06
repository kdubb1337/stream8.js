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

	it('can be collected', function () {
		var collector = function(val) {
			return val.id;
		};

		expect([].stream().collect(collector)).toEqual({});
		expect([undefined].stream().collect(collector))
			.toEqual({
				'undefined':[undefined]
			});
		expect([undefined, NaN, null, undefined].stream().collect(collector))
			.toEqual({
				'undefined':[undefined, NaN, null, undefined]
			});

		var people = [{id:1, name:"bob"},
			{id:2, name:"joe"},
			{name:"bob"},
			{id:1, name:"jane"}]

		expect(people.stream().collect(collector))
			.toEqual({
				'undefined':[{name:"bob"}],
				'1':[{id:1, name:"bob"},{id:1, name:"jane"}],
				'2':[{id:2, name:"joe"}]
			});
	});

	it('can be collect to a map of the first values', function () {
		var collector = function(val) {
			return val.id;
		};

		expect([].stream().collectFirst(collector)).toEqual({});
		expect([undefined].stream().collectFirst(collector))
			.toEqual({
				'undefined':undefined
			});
		expect([undefined, NaN, null, undefined].stream().collectFirst(collector))
			.toEqual({
				'undefined':undefined
			});
		expect([NaN, undefined, null, undefined].stream().collectFirst(collector))
			.toEqual({
				'undefined':NaN
			});
		expect([null, undefined, NaN, undefined].stream().collectFirst(collector))
			.toEqual({
				'undefined':null
			});

		var people = [{id:1, name:"bob"},
			{id:2, name:"joe"},
			{name:"bob"},
			{id:1, name:"jane"}]

		expect(people.stream().collectFirst(collector))
			.toEqual({
				'undefined':{name:"bob"},
				'1':{id:1, name:"bob"},
				'2':{id:2, name:"joe"}
			});
	});

	it('can check to see if an object is present', function () {
		var complexObject = {
			id:1,
			names:["bob", "jane"]
		};
		var array = [undefined, NaN, null, ["a", "c"], 123, "a",
			complexObject, [1, 2, 3]];

		expect(array.stream().contains(undefined)).toBe(true);
		expect(array.stream().contains(NaN)).toBe(true);
		expect(array.stream().contains(null)).toBe(true);
		expect(array.stream().contains(123)).toBe(true);
		expect(array.stream().contains(122)).toBe(false);
		expect(array.stream().contains(-123)).toBe(false);
		expect(array.stream().contains("a")).toBe(true);
		expect(array.stream().contains("aa")).toBe(false);
		expect(array.stream().contains("b")).toBe(false);
		expect(array.stream().contains([1, 2, 3])).toBe(true);
		expect(array.stream().contains([1, 3, 2])).toBe(false);
		expect(array.stream().contains([1, 2])).toBe(false);
		expect(array.stream().contains(["a", "c"])).toBe(true);
		expect(array.stream().contains(["c", "a"])).toBe(false);
		expect(array.stream().contains(["a", "c", "b"])).toBe(false);
		expect(array.stream().contains(["a"])).toBe(false);
		expect(array.stream().contains({})).toBe(false);
		expect(array.stream().contains({id:1})).toBe(false);
		expect(array.stream().contains({id:2,names:["bob", "jane"]})).toBe(false);
		expect(array.stream().contains({id:1,names:undefined})).toBe(false);
		expect(array.stream().contains({id:1,names:[]})).toBe(false);
		expect(array.stream().contains({id:1,names:["bob"]})).toBe(false);
		expect(array.stream().contains({id:1,names:["jane", "bob"]})).toBe(false);
		expect(array.stream().contains({names:["bob", "jane"]})).toBe(false);
		expect(array.stream().contains({id:1,names:["bob", "jane"],email:"ddd"})).toBe(false);
		expect(array.stream().contains({id:1,names:["bob", "jane"]})).toBe(true);

		expect(Stream.empty().contains(undefined)).toBe(false);
		expect(Stream.empty().contains(1)).toBe(false);
		expect(Stream.empty().contains("a")).toBe(false);
		expect(Stream.range(0, 10).contains(0)).toBe(true);
		expect(Stream.range(0, 10).contains(1)).toBe(true);
		expect(Stream.range(0, 10).contains(10)).toBe(true);
		expect(Stream.range(0, 10).contains(-1)).toBe(false);
		expect(Stream.range(0, 10).contains(11)).toBe(false);
		expect(Stream.range(0, 10).contains("a")).toBe(false);
		expect(Stream.range(0, 10).contains([1])).toBe(false);
		expect(Stream.range(0, 10).contains({id:1})).toBe(false);
	});

	it('can be counted', function () {
		expect([].stream().count()).toBe(0);
		expect([1].stream().count()).toBe(1);
		expect([{}].stream().count()).toBe(1);
		expect(["c", "b", "c", "a"].stream().count()).toBe(4);
		expect([{name:"b"}, {name:"a"}].stream().count()).toBe(2);
		expect([undefined, undefined, NaN, NaN, null].stream().count()).toBe(5);
	});

	it('can allow for only distinct values', function () {
		expect([].stream().distinct().count()).toBe(0);
		expect(["a"].stream().distinct().toArray()).toEqual(["a"]);
		expect(["a", "b", "a"].stream().distinct().toArray()).toEqual(["a", "b"]);
		expect(["a", "a", "b"].stream().distinct().toArray()).toEqual(["a", "b"]);
		expect([1, "a", 1, "b", "a"].stream().distinct().toArray()).toEqual([1, "a", "b"]);
		expect(["a", undefined, undefined, "b"].stream().distinct().toArray())
			.toEqual(["a", undefined, "b"]);
		expect(["a", NaN, NaN, "b"].stream().distinct().toArray())
			.toEqual(["a", NaN, "b"]);
		expect(["a", null, null, "b"].stream().distinct().toArray())
			.toEqual(["a", null, "b"]);
		expect([{}, {}].stream().distinct().toArray())
			.toEqual([{}]);
		expect([{id:1}, {id:2}].stream().distinct().toArray())
			.toEqual([{id:1}, {id:2}]);
		expect([{id:1}, {id:1}].stream().distinct().toArray())
			.toEqual([{id:1}]);
		expect([{id:1}, {ids:1}].stream().distinct().toArray())
			.toEqual([{id:1}, {ids:1}]);
		expect([{id:1, names:["a", 1]}, {id:1, names:["a", 1]}].stream().distinct().toArray())
			.toEqual([{id:1, names:["a", 1]}]);
		expect([{id:1, names:["a", 1]}, {id:1, names:["a", 2]}].stream().distinct().toArray())
			.toEqual([{id:1, names:["a", 1]}, {id:1, names:["a", 2]}]);
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

	it('can return the first matching element', function () {
		expect([].stream().findFirst()).toEqual(undefined);
		expect(["a", 1, undefined].stream().findFirst()).toEqual("a");
		expect([undefined, "a", 1].stream().findFirst()).toEqual(undefined);
		expect([NaN, "a", 1].stream().findFirst()).toEqual(NaN);
		expect([null, "a", 1].stream().findFirst()).toEqual(null);
		expect([1, undefined, "a"].stream().findFirst()).toEqual(1);
		expect([{name:"bob"}, "a"].stream().findFirst()).toEqual({name:"bob"});

		expect(Stream.empty().findFirst()).toEqual(undefined);
		expect(Stream.range().findFirst()).toEqual(1);
	});

	it('can be flattened', function () {
		var people1 = [{ids:[1, 2, 3]}, NaN, undefined, {ids:[4, 5, 6]}];
		var flattener = function(val) {
			return val.ids;
		};

		expect(people1.stream().flatMap(flattener).toArray())
			.toEqual([1, 2, 3, 4, 5, 6]);
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

	it('can map to a new stream', function() {
		var mapper = function(val) {
			return val.salary;
		};

		expect([].stream().map(mapper).count()).toBe(0);
		expect([].stream().map(mapper).isEmpty()).toBe(true);
		expect([undefined].stream().map(mapper).count()).toEqual(0);
		expect([undefined].stream().map(mapper).isEmpty()).toBe(true);
		expect(["a", 1].stream().map(mapper).toArray())
			.toEqual([undefined, undefined]);
		expect([{salary:5}, {salary:46}].stream().map(mapper).count()).toBe(2);
		expect([{salary:5}, {salary:46}].stream().map(mapper).sum()).toBe(51);
		expect([{salary:5}, {salary:46}].stream().map(mapper).average()).toBe(25.5);

		expect([{salary:5}, {name:46}].stream().map(mapper).count()).toBe(2);
		expect([{name:5}, {salary:46}].stream().map(mapper).sum()).toBe(46);
		expect([{name:5}, {salary:46}].stream().map(mapper).head)
			.toEqual(undefined);

		expect(Stream.empty().map(mapper).isEmpty()).toBe(true);

		var builder = {
			counter: 0,
			get: function() {
				this.counter++;
				return {
					id: this.counter,
					salary: 100 * this.counter
				};
			},
			// Reset the builder to initial conditions so we can replay it
			reset: function() {
				this.counter = 0;
			}
		};

		expect(Stream.generate(builder).limit(100).map(mapper).isEmpty()).toBe(false);
		builder.reset();
		expect(Stream.generate(builder).limit(100).map(mapper).count()).toBe(100);
		builder.reset();
		expect(Stream.generate(builder).limit(100).map(mapper).sum()).toBe(505000);
		builder.reset();
		expect(Stream.generate(builder).limit(100).map(mapper).average()).toBe(5050);
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

	it('can skip elements', function () {
		expect([].stream().skip(5).isEmpty()).toBe(true);
		expect([undefined, NaN, null, {name:"bob"}].stream().skip(2).toArray()).toEqual([null, {name:"bob"}]);
		expect([null, {name:"bob"}, undefined, NaN].stream().skip(2).toArray()).toEqual([undefined, NaN]);
		expect([undefined, 1, 2].stream().skip(5).isEmpty()).toBe(true);
		expect([undefined, 1, 2].stream().skip(5).toArray()).toEqual([]);
		expect([undefined, 1, 2].stream().skip(0).toArray()).toEqual([undefined, 1, 2]);
		expect([undefined, 1, 2].stream().skip(2).isEmpty()).toBe(false);
		expect([undefined, 1, 2, "a"].stream().skip(2).toArray()).toEqual([2, "a"]);
		expect([1, 2, undefined, "a"].stream().skip(2).toArray()).toEqual([undefined, "a"]);

		expect(Stream.empty().skip(5).isEmpty()).toBe(true);
		expect(Stream.empty().skip(0).toArray()).toEqual([]);
		expect(Stream.range().skip(0).limit(5).toArray()).toEqual([1, 2, 3, 4, 5]);
		expect(Stream.range().skip(-10).limit(5).toArray()).toEqual([1, 2, 3, 4, 5]);
		expect(Stream.range().skip(5).limit(5).toArray()).toEqual([6, 7, 8, 9, 10]);
		expect(Stream.range().skip(5).limit(5).sum()).toBe(40);
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