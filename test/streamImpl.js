describe('A Stream', function () {
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
});