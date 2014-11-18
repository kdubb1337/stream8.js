var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
	return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
	if (TEST_REGEXP.test(file)) {
    	// Normalize paths to RequireJS module names.
    	allTestFiles.push(pathToModule(file));
  	}
});

require.config({
	// Karma serves files under /base, which is the basePath from your config file
	baseUrl: '/base',

	// dynamically load all test files
	deps: allTestFiles,

	// we have to kickoff jasmine, as it is asynchronous
	callback: window.__karma__.start
});


describe('arrays to streams', function () {
	it('can be made and accessess', function () {
		expect(["c", "b", "c", "a"].stream().count()).toBe(4);
		expect([].stream().count()).toBe(0);
		expect([1].stream().count()).toBe(1);
		expect([{}].stream().count()).toBe(1);
		expect([{name:"b"}, {name:"a"}].stream().count()).toBe(2);
	});
});