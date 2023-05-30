# qlcjs

Generates questions about concrete constructs and patterns in a given
JavaScript program. These questions (including answering options) can be posed
to a learner to practice introductory programming. These questions include
elements to develop program comprehension and program tracing.

Automatic generation enables systems to pose the generated questions to leaners
about their own programs that they previously programmed. Such Questions About
Learners' Code (QLCs) may have self-reflection and self-explanation effects
that are of interest in computing education research.

### References

The implementation was inspired by the work of Evan Cole on
[study-lenses](https://github.com/colevandersWands/study-lenses).

Analysis and transformations of the input programs depend on
[Shift tools](https://shift-ast.org/) by Shape Security, Inc.
These libraries are available under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

The concept of Questions About Learners' Code (QLCs) is first introduced by Lehtinen et al. in
[Let's Ask Students About Their Programs, Automatically](https://doi.org/10.1109/ICPC52881.2021.00054).

---

### Example result

```TypeScript
function power(a, b) {
  let n = 1;
  for (let i = 0; i < b; i++) {
    n *= a;
  }
  return n;
}
```

Which is the name of the function? [FunctionName]
* a [parameter_name] _<small>This is a parameter name for a value passed as an argument when calling the function</small>_
* b [parameter_name] _<small>This is a parameter name for a value passed as an argument when calling the function</small>_
* function [keyword] _<small>The keyword/command "function" is used when the program is about to declare a function</small>_
* let [keyword] _<small>This is a program keyword/command used inside the function body</small>_
* power [function_name] _<small>Correct, this is the name</small>_

Which are the parameter names of the function? [ParameterName]
* a [parameter_name] _<small>Correct, this is one of the 2 parameter names for this function</small>_
* b [parameter_name] _<small>Correct, this is one of the 2 parameter names for this function</small>_
* function [keyword] _<small>The keyword/command "function" is used when the program is about to declare a function</small>_
* power [function_name] _<small>This is the name of the function that is used to call the function</small>_
* return [keyword] _<small>This is a program keyword/command used inside the function body</small>_

Which value does <em>a</em> have when execution of <em>power(2, 2)</em> starts? [ParameterValue]
* 1 [literal] _<small>This is a literal value that is used inside the function body</small>_
* 2 [parameter_value] _<small>Correct, this is the value passed as an argument for the given parameter</small>_
* a [parameter_name] _<small>This is a parameter name for a value passed as an argument when calling the function</small>_

A program loop starts on line 3. Which is the last line inside it? [LoopEnd]
* 2 [line_before_block] _<small>The loop starts after this line</small>_
* 3 [line_inside_block] _<small>This line is inside the loop BUT it is not the last one</small>_
* 4 [last_line_inside_block] _<small>Correct, this is the last line inside the loop (closing curly bracket may appear later)</small>_
* 6 [line_after_block] _<small>The loop ends before this line</small>_

A value is assigned to variable <em>n</em> on line 4. On which line is <em>n</em> declared? [VariableDeclaration]
* 0 [random_line] _<small>This is a random line that does not handle the given variable</small>_
* 2 [declaration_line] _<small>Correct, this is the line where the variable is declared using the keyword let</small>_
* 4 [reference_line] _<small>This line references (reads or writes) the given variable BUT it is declared before</small>_
* 5 [random_line] _<small>This is a random line that does not handle the given variable</small>_
* 6 [reference_line] _<small>This line references (reads or writes) the given variable BUT it is declared before</small>_

Which is the ordered sequence of values that are assigned to variable <em>i</em> while executing <em>power(2, 2)</em>? [VariableTrace]
* 0, 1 [trace_miss_last] _<small>No, this sequence is missing a value that gets assigned</small>_
* 0, 1, 2 [trace] _<small>Correct, step by step these values are assigned to the variable</small>_
* 0, 1, 2, 3 [trace_extra_last] _<small>No, this sequence has an extra value that is not assigned</small>_
* 1, 2 [trace_miss_first] _<small>No, this sequence is missing a value that gets assigned</small>_
* 1, 2, 0 [trace_shuffled] _<small>No, this is an incorrect random sequence</small>_

---

### Usage

The library is implemented in TypeScript and the types can describe a great deal of the API.

    npm install git+https://github.com/teemulehtinen/qlcjs

```TypeScript
import { generate, QLCRequest, ProgramInput, QLC } from 'qlcjs';

const req: QLCRequest[] = [
  {
    count: 1, // Number of questions to generate if possible
    types: ['FunctionName', 'ParameterName'], // Accepted question types
  },
  {
    count: 3,
    fill: true, // Fill in missing number of questions for the count
    uniqueTypes: true, // Only accept one question for each question type
  },
];

const input: ProgramInput = {
  functionName: 'task', // Try to evaluate this function to collect dynamic data
  arguments: [[0, 'a'], [1, 'b'], [2, 'c']], // Use one set from these arguments
};

const questions: QLC[] = generate(sourceCode, req, input);
```

Example of using the build unpkg-module:
`npm install && npm run build && ls dist/qlcjs.min.js`

```HTML
<script src="qlcjs.min.js"></script>
<script>
  const qlcs = qlcjs.generate(sourceCode, [
    { count: 1, types: ['FunctionName', 'ParameterName'] },
    { count: 3, fill: true, uniqueTypes: true }
  ]);
  qlcs.forEach(qlc => {
    console.log(qlc.type, qlc.question, qlc.options);
  });
</script>
```
