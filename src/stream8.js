(function () {
	function StreamImpl(head, tail) {
	    if(typeof tail == 'undefined') {
	        tail = function () {
	            return Stream.empty();
	        };
	    }
		this.head = head;
	    this.tail = tail;
	}

	var newOfSameType = function(obj, head, tail) {
		if(typeof obj == 'StreamImpl') {
			return new StreamImpl(head, tail);
		}

		return new ArrayStreamImpl(head, tail);
	};

	var isBadValue = function(val) {
		return val === undefined || val === null || isReallyNaN(val);
	};

	var isReallyNaN = function(val) {
		return typeof val == 'number' && isNaN(parseInt(val));
	};

	// Deep equality check
	var equals = function(a, b) {
		if(a === b) {
			return true;
		}

		if(a === undefined || b === undefined || a === null || b === null) {
			return false;
		}

		var typeofA = typeof a;

		if(typeofA !== typeof b) {
			return false;
		}

		var isAReallyNaN = isReallyNaN(a);
		var isBReallyNaN = isReallyNaN(b);

		if(isAReallyNaN && isBReallyNaN) {
			return true;
		}
		else if (isAReallyNaN || isBReallyNaN) {
			return false;
		}

		/* We won't check functions, and if it is a number or string it doesn't 
			match if it made it this far down */
		if(typeofA === 'string' || typeofA === 'number' || typeofA === 'function') {
			return false;
		}

		var aIsArray = Array.isArray(a);

		if(aIsArray && Array.isArray(b)) {
			if(a.length !== b.length) {
				return false;
			}

			for(var i = 0; i < a.length; i++) {
				if (!equals(a[i], b[i])) {
					return false;
				}
			}

			return true;
		}
		else if(aIsArray) {
			return false;
		}
		// Both objects
		else {
			var keys = Object.keys(a);

			if(keys.length !== Object.keys(b).length) {
				return false;
			}

			for(var i = 0; i < keys.length; i++) {
				var key = keys[i];

				if (!equals(a[key], b[key])) {
					return false;
				}
			}

			return true;
		}

		return false;
	};

	var innerDistinct = function(stream, previousValues) {
		if(stream.isEmpty()) {
			return stream;
		}

		if(!previousValues.stream().contains(stream.head)) {
			previousValues[previousValues.length] = stream.head;
			return newOfSameType(stream, stream.head, function () {
				return innerDistinct(stream.tail(), previousValues);
			});
		}
		return innerDistinct(stream.tail(), previousValues);
	};

	StreamImpl.prototype = {
		average: function() {
			var count = 0;
			var total = 0;

			this.forEach(function(val) {
				if(!isNaN(val)) {
					count++;
					total += val;
				}
			});

			return count === 0 ? 0 : total / count;
		},
		collect: function(collector) {
			var result = {};

			this.forEach(function(val) {
				var key = isBadValue(val) ? undefined : collector(val);

				// If this is the first value in the key
				if(!result.hasOwnProperty(key)) {
					result[key] = [];
				}

				// Add this value to the array for the key
				result[key][result[key].length] = val;
			});

			return result;
		},
		collectFirst: function(collector) {
			var result = {};

			this.forEach(function(val) {
				var key = isBadValue(val) ? undefined : collector(val);

				// If this is the first value in the key
				if(!result.hasOwnProperty(key)) {
					result[key] = val;
				}
			});

			return result;
		},
		contains: function(obj) {
			return this.forEach(function(val) {
				if(equals(obj, val)) {
					return true;
				}
			}, false);
		},
		count: function() {
			if(this.isEmpty()) {
				return 0;
			}

			return this.tail().count() + 1;
		},
		distinct: function() {
			return innerDistinct(this, []);
		},
		isEmpty: function() {
			return typeof this.head == 'undefined';
		},
		filter: function(predicate) {
			if(this.isEmpty()) {
				return this;
			}

			var head = this.head;

			// prevent bad values passing through
			if(!isBadValue(head) && predicate(head)) {
				var self = this;
				return newOfSameType(this, head, function () {
					return self.tail().filter(predicate);
				});
			}
			return this.tail().filter(predicate);
		},
		findFirst: function() {
			return this.head;
		},
		flatMap: function(mapper) {
			if(this.isEmpty()) {
				return this;
			}

			if(isBadValue(this.head)) {
				return this.tail().flatMap(mapper);
			}

			return Stream.concat(mapper(this.head).stream(), this.tail().flatMap(mapper));
		},
		/* Terminal */
		forEach: function(consumer, defaultResult, curIndex) {
			if(curIndex === undefined) {
				curIndex = 0;
			}

			if(this.isEmpty()) {
				return defaultResult;
			}

			var val = consumer(this.head, curIndex++);

			if(val !== undefined) {
				return val;
			}

			var next = this.tail();

			if(next !== undefined) {
				val = next.forEach(consumer, defaultResult, curIndex);
			}

			return val ? val : defaultResult;
		},
		limit: function(maxElements) {
			if(maxElements < 1 || this.isEmpty())
				return Stream.empty();

			var self = this;
			return newOfSameType(this, this.head, function() {
				return self.tail().limit(--maxElements);
			});
		},
		map: function(mapper) {
			if(this.isEmpty()) {
				return this;
			}

			if(isBadValue(this.head)) {
				return this.tail().map(mapper);
			}

			var self = this;
			return newOfSameType(this, mapper(this.head), function() {
				return self.tail().map(mapper);
			});
		},
		/* Terminal */
		toArray: function() {
			var result = [];

			this.forEach(function(val) {
				result[result.length] = val;
			});

			return result;
		},
		/* Terminal */
		toString: function() {
			var result = "[stream={ ";

			this.forEach(function(val) {
				result += "'" + val + "' ";
			});

			return result + "}]";
	    },
	    skip: function(num) {
	    	var start = this;

	    	for(var i = 0; i < num; i++) {
	    		if(start.isEmpty()) {
	    			return Stream.empty();
	    		}

	    		start = start.tail();
	    	}

	    	if(start.isEmpty()) {
    			return Stream.empty();
    		}

	    	return newOfSameType(start, start.head, start.tail);
	    },
		sum: function() {
			if(this.isEmpty())
				return 0;

			return !isNaN(this.head) ? this.head + this.tail().sum() :
				this.tail().sum();
		}
	};

	function ArrayStreamImpl(head, tail) {
		StreamImpl.call(this, head, tail);
	}

	// Add StreamImpl methods
	ArrayStreamImpl.prototype = Object.create(StreamImpl.prototype);

	/*  We will be sure to return a Stream.empty() when the ArrayStream has reached the end.
	 *  This allows us to safely handle undefines in the ArrayStream, knowing there's more to come
	 */
	ArrayStreamImpl.prototype.isEmpty = function() {return false;}

	var Stream = {
		concat: function(streamA, streamB) {
			if(streamA.isEmpty()) {
				return streamB;
			}

			return newOfSameType(streamA, streamA.head, function() {
				return Stream.concat(streamA.tail(), streamB);
			});
		},
		empty: function() {
			return new StreamImpl();
		},
		generate: function(supplier) {
			var head = supplier.get();

			if(head === undefined) {
				return this.empty();
			}

		    return new StreamImpl(head, function() {
		    	return Stream.generate(supplier);
		    });
		},
		range: function (low, high) {
		    if(low === undefined) {
		        low = 1;
		    }

			return Stream.generate({
				low: low,
		    	high: high,
		    	get: function () {
		    		if(this.high !== undefined && this.low > this.high) {
		    			return undefined;
		    		}

		    		return this.low++;
		    	}
			});
		}
	};

	if(!Array.prototype.stream) {
		Array.prototype.stream = function() {
			if(this.length === 0)
				return Stream.empty();

			var self = this;
			return new ArrayStreamImpl(this[0], function() {
				var val = self.slice(1);
				return val === undefined || val.length === 0 ? Stream.empty() : val.stream();
			});
		}
	}

	var isCommonJS = typeof module !== 'undefined' && module.exports;
	if(isCommonJS) {
		module.exports = Stream;
	} else {
		self.Stream = Stream;
	}
})();