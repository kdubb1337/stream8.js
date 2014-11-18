stream8.js
==========

Map-reduce operations based on <a href="https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html" target="_blank">Java8's Stream</a>. I'm targeting a subset of these as it is tailored to the differences in Javascript such as weak typing and how 'this' is handled.

Background: Streams are an efficient, functional way to reduce boilerplate code for common array manipulation tasks. You'll start coding less, coding quicker and have code which is not only easier to read, but less prone to errors.

To get started you can include Stream8 with bower using <code>"stream8": "~0.1.1"</code> or you can download the source from the app folder and or the minified version from dist.

Now you're ready to use streams. You can create a stream by using .stream() on an array like so:
<code>["c", "a", "b"].stream()</code>

or if you have an array var, it looks like this:

<code>var array =["c", "a", "b"];
array.stream()</code>
