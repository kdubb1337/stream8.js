stream8.js
==========

Streams are an efficient, functional way to reduce boilerplate code for common array manipulation tasks. You'll start coding less, coding quicker and have code which is not only easier to read, but less prone to errors.

<h3>Installation</h3>
Stream8 is on bower with <code>"stream8": "~0.1.5"</code> or you can download the source from the app folder and or the minified version from dist.

<h3>What does it do?</h3>
I love examples.

Example 1: Calculate the average salary of people in the HR deparement. <i>people</i> is an array of objects like this {department:"myDepartment",salary:52000}
<pre><code>var averageSalary = people.stream()
		.filter(function(val) { return val.department == 'HR'; }) // Find only people from HR
		.map(function(val) { return val.salary; }) // Turn the stream into their salaries
		.average(); // Average the salaries</code></pre>

Example 2: A common scenario is you may get some data via REST and you want to organize it so you can more quickly look up an object by a value. In this example I want to organize an array of things based on their IDs. things is an array of the following: [{id:23, name:'bob'}, {id:45, name:'jane'}, ...]
<pre><code>var thingMap = things.stream()
		.collectFirst(function(val) { return val.id;}); // Make a map based on the id field of each object</code></pre>

Result:
<pre><code>{
	23: {id:23, name:'bob'},
	45: {id:45, name:'jane'},
	...
}</code></pre>

With this map I can call thingMap[id] and get back the thing with that id. This approach reduces repetitively looping through a large array everytime I want to find a value.

<h3>Background</h3>
Arrays are great at storing data but not so great at performing computations. Stream8 offers a highly efficient way to perform operations on elements, re-organize into another array or calculate a value.

One key feature is the intermediate steps are done <i>lazily</i>. This means if I do something like this: <code>array.stream().filter(crazyLongFunction).limit(0).toArray()</code> that long running fuction will never be called and I'll immediately get an empty array back. You can think of a stream as a pipeline and each intermediate step will ask the previous step for a value only when it needs one. If you don't use Streams and instead use the built in array.filter (even if the browser supports array.filter!)... it'll happily call crazyLongFunction for every element in the array because the operations on the native array are performed <i>eagerly</i>.

Map-reduce operations based on <a href="https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html" target="_blank">Java8's Stream</a>. Stream8 is a loose subset of these as it is tailored to the differences in Javascript such as weak typing and how 'this' is handled.
