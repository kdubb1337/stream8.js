(function () {
	var emptyStream = function() {
		return new Stream();
	}

	function Stream(head, tailPromise) {
	    if (typeof head != 'undefined') {
	        this.headValue = head;
	    }
	    if (typeof tailPromise == 'undefined') {
	        tailPromise = function () {
	            return new Stream();
	        };
	    }
	    this.tailPromise = tailPromise;
	}

	Stream.prototype = {
		/* Terminal */
		count: function() {
			if(this.isEmpty()) {
				return 0;
			}

			return this.tailPromise().count() + 1;
		},
		empty: function() {
			return emptyStream();
		},
		filter: function(predicate) {
			if(this.isEmpty()) {
				return this;
			}

			var head = this.headValue;
			var tail = this.tailPromise();

			if(predicate(head)) {
				return new Stream(head, function () {
					return tail.filter(predicate);
				});
			}
			return tail.filter(predicate);
		},
		isEmpty: function() {
			return this.headValue === undefined;
		},
		/* Terminal */
		forEach: function(consumer, defaultResult, curIndex) {
			if(curIndex === undefined) {
				curIndex = 0;
			}

			if(this.isEmpty()) {
				return defaultResult;
			}

			var val = consumer(this.headValue, curIndex++);

			if(val !== undefined) {
				return val;
			}

			var next = this.tailPromise();

			if(next !== undefined) {
				val = next.forEach(consumer, defaultResult, curIndex);
			}

			return val ? val : defaultResult;
		},
		limit: function(maxElements) {
			if(this.isEmpty() || maxElements < 1)
				return emptyStream();

			if(maxElements === 0) {
				return new Stream(this.headValue, function() {
					return emptyStream();
				});
			}

			var next = this.tailPromise();

			if(next === undefined) {
				return new Stream(this.headValue, function() {
					return emptyStream();
				});
			}

			return new Stream(this.headValue, function() {
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
			return new Stream(this[0], function() {
				var val = self.slice(1);
				return val === undefined || val.length === 0 ? emptyStream() : val.stream();
			});
		}
	}
})();