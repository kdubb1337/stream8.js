stream8.js
==========
<h3>Background</h3>
Streams are an efficient, functional way to reduce boilerplate code for common array manipulation tasks. You'll start coding less, coding quicker and have code which is not only easier to read, but less prone to errors.

<h3>Installation</h3>
Stream8 is on bower with <code>"stream8": "~0.1.2"</code> or you can download the source from the app folder and or the minified version from dist.

<h3>Getting Started</h3>
Now you're ready to use streams. You can create a stream by using .stream() on an array like so:
<pre><code>["c", "a", "b"].stream()</code></pre>

or if you have an array var, it looks like this:

<pre><code>var array =["c", "a", "b"];
array.stream()</code></pre>

<h3>Background</h3>
Map-reduce operations based on <a href="https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html" target="_blank">Java8's Stream</a>. Stream8 is a loose subset of these as it is tailored to the differences in Javascript such as weak typing and how 'this' is handled.