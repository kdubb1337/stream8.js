(function () {
	function StreamImpl(head, tail) {
	    if (typeof tail === 'undefined') {
	        tail = function () {
	            Stream.empty();
	        };
	    }
		this.head = head;
	    this.tail = tail;
	}

	StreamImpl.prototype = {
		/* Terminal */
		count: function() {
			if(this.isEmpty()) {
				return 0;
			}

			return this.tail().count() + 1;
		},
		empty: function() {
			return Stream.empty();
		},
		filter: function(predicate) {
			if(this.isEmpty()) {
				return this;
			}

			var head = this.head;
			var tail = this.tail();

			if(predicate(head)) {
				return new StreamImpl(head, function () {
					return tail.filter(predicate);
				});
			}
			return tail.filter(predicate);
		},
		isEmpty: function() {
			return this.head === undefined;
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
			if(this.isEmpty() || maxElements < 1)
				return Stream.empty();

			if(maxElements === 0) {
				return new StreamImpl(this.head, function() {
					return Stream.empty();
				});
			}

			var next = this.tail();

			if(next === undefined) {
				return new StreamImpl(this.head, function() {
					return Stream.empty();
				});
			}

			return new StreamImpl(this.head, function() {
				return next.limit(--maxElements);
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
	    }
	};

	if(!Array.prototype.stream) {
		Array.prototype.stream = function() {
			var self = this;
			return new StreamImpl(this[0], function() {
				var val = self.slice(1);
				return val === undefined || val.length === 0 ? Stream.empty() : val.stream();
			});
		}
	}

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

	var isCommonJS = typeof module !== 'undefined' && module.exports;
	if(isCommonJS) {
		module.exports = Stream;
	} else {
		self.Stream = Stream;
	}
})();