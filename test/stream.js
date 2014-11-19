describe('Stream factory', function () {
	it('can create an empty stream', function () {
		expect(Stream.empty().isEmpty()).toBe(true);
		expect(Stream.empty().head).toEqual(undefined);
		expect(Stream.empty().tail).not.toEqual(undefined);
		expect(Stream.empty().tail()).not.toEqual(undefined);
		expect(Stream.empty().tail().head).toEqual(undefined);
		expect(Stream.empty().tail().tail().head).toEqual(undefined);
		expect(Stream.empty().tail().tail().tail().head).toEqual(undefined);
	});

	it('can create a generate a stream from a function', function () {
		var fibonacci = {
			beforePrev: 1,
			prev: 0,
			get: function() {
				var next = this.beforePrev + this.prev;
				this.beforePrev = this.prev;
				this.prev = next;
				return next;
			}
		};
		
		expect(Stream.generate(fibonacci).limit(10).toArray())
			.toEqual([1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
	});

	it('can create a range of integers', function () {
		expect(Stream.range(0, 5).count()).toBe(6);
		expect(Stream.range(0, 5).toArray()).toEqual([0, 1, 2, 3, 4, 5]);
		expect(Stream.range(4, 7).toArray()).toEqual([4, 5, 6, 7]);
		expect(Stream.range(-4, 1).toArray()).toEqual([-4, -3, -2, -1, 0, 1]);

		expect(Stream.range(5).head).toBe(5);
		expect(Stream.range(5).tail().head).toBe(6);
		expect(Stream.range(-5).head).toBe(-5);

		var naturalNumbers = Stream.range();
		expect(naturalNumbers.head).toBe(1);

		for(var i = 2; i < 1000; i++) {
			expect(naturalNumbers.tail().head).toBe(i);
		}
	});
});