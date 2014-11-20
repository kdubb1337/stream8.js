stream8.js
==========

Streams are an efficient, functional way to reduce boilerplate code for common array manipulation tasks. You'll start coding less, coding quicker and have code which is not only easier to read, but less prone to errors.

<h3>Installation</h3>
Stream8 is on bower with <code>"stream8": "~0.1.2"</code> or you can download the source from the app folder and or the minified version from dist.

<h3>What does it do?</h3>
I love examples.

Example1: Calculate the average salary of people in the HR deparement (<i>people</i> is an array of objects like this {department:"myDepartment",salary:52000})
<pre><code>int averageSalary = people.stream()
		.filter(function(val) {
			return val.department == 'HR';
		})
		.map(function(val) {
			return val.salary;
		})
		.average()</code></pre>

<h3>Background</h3>
Arrays are great at storing data but not so great at performing computations. Stream8 offers a highly effiecient way to quickly perform operations on elements, re-organize into another array or calculate a value. Map-reduce operations based on <a href="https://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html" target="_blank">Java8's Stream</a>. Stream8 is a loose subset of these as it is tailored to the differences in Javascript such as weak typing and how 'this' is handled.
