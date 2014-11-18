describe('main stream functionality', function () {
	it('can be counted', function () {
		expect([].stream().count()).toBe(0);
		expect([1].stream().count()).toBe(1);
		expect([{}].stream().count()).toBe(1);
		expect(["c", "b", "c", "a"].stream().count()).toBe(4);
		expect([{name:"b"}, {name:"a"}].stream().count()).toBe(2);
	});

	it('can be empty', function () {
		expect([undefined, "a"].stream().isEmpty()).toBe(false);
		expect([NaN].stream().isEmpty()).toBe(false);
		expect(["a"].stream().isEmpty()).toBe(false);
		expect(["NaN"].stream().isEmpty()).toBe(false);
		expect(["a", "b", "c"].stream().isEmpty()).toBe(false);
		expect([{}].stream().isEmpty()).toBe(false);
		expect([{name:"b"}, {name:"a"}].stream().isEmpty()).toBe(false);
		expect([].stream().isEmpty()).toBe(true);
	});
});