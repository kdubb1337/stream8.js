describe('arrays to streams', function () {
	it('can be made w/head', function () {
		expect([].stream().head).toBe(undefined);
		expect([1].stream().head).toBe(1);
		expect(["c", "b", "c", "a"].stream().head).toBe("c");
		expect([NaN, "b", "c", "a"].stream().head).toEqual(NaN);
		expect([{}].stream().head).toEqual({});
		expect([{name:"b"}, {name:"a"}].stream().head).toEqual({name:"b"});
	});

	it('can be made w/tail', function () {
		// next function will tidy up the tests so we don't have to keep going stream.tail().tail()... etc
		var next = function next(stream, depth) {
			if(depth === undefined)
				return stream.tail().head;

			var temp = stream;

			for(var i = 0; i < depth; i++) {
				temp = temp.tail();
			}

			return temp.head;
		};

		expect(next([].stream())).toBe(undefined);
		expect(next([1].stream())).toBe(undefined);
		
		var stream = ["c", "b", "c", "a"].stream();
		expect(next(stream)).toBe("b");
		expect(next(stream, 2)).toBe("c");
		expect(next(stream, 3)).toBe("a");
		expect(next(stream, 4)).toBe(undefined);

		stream = [NaN, "b", "c", "a"].stream();
		expect(next(stream)).toBe("b");
		expect(next(stream, 2)).toBe("c");
		expect(next(stream, 3)).toBe("a");
		expect(next(stream, 4)).toBe(undefined);

		expect(next([{}].stream())).toBe(undefined);

		stream = [{name:"b"}, {name:"a"}].stream();
		expect(next(stream)).toEqual({name:"a"});
		expect(next(stream, 2)).toBe(undefined);
	});
});