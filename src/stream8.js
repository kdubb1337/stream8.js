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

	var isValidNumber = function(val) {
		return typeof val == 'number' && !isNaN(val);
	}

	StreamImpl.prototype = {
		average: function() {
			var count = 0;
			var total = 0;

			this.forEach(function(val) {
				if(isValidNumber(val)) {
					count++;
					total += val;
				}
			});

			return count === 0 ? 0 : total / count;
		},
		count: function() {
			if(this.isEmpty()) {
				return 0;
			}

			return this.tail().count() + 1;
		},
		isEmpty: function() {
			return typeof this.head == 'undefined';
		},
		filter: function(predicate) {
			if(this.isEmpty()) {
				return this;
			}

			var head = this.head;
			var tail = this.tail();

			if(predicate(head)) {
				return newOfSameType(this, head, function () {
					return tail.filter(predicate);
				});
			}
			return tail.filter(predicate);
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

			var next = this.tail();
			return newOfSameType(this, this.head, function() {
				return next.limit(--maxElements);
			})
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
		sum: function() {
			if(this.isEmpty())
				return 0;

			return isValidNumber(this.head) ? this.head + this.tail().sum() :
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