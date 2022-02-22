# qlcjs

Generates questions about concrete constructs and patterns in a given JavaScript program.
These questions (including answering options) can be posed to a learner to practice
introductory programming. These questions include elements to develop program comprehension
and program tracing.

Automatic generation enables systems to pose the generated questions to leaners
about their own programs that they just programmed. Such Questions About Learners' Code (QLCs)
may have self-reflection and self-explanation effects that are of interest
in computing education research.

### Usage

Typescript:

    import { generate, QLCRequest, QLC } from 'qlcjs';
    const q1: QLCRequest = {
      count: 1, // Number of questions to generate if possible
      types: ['FunctionName', 'ParameterName'], // Accepted question types
    };
    const fillTo3: QLCRequest = {
      count: 3,
      fill: true, // Fill the count together with questions for earlier requests
      uniqueTypes: true, // Only accept one question for each question type
    }
    const questions: QLC[] = generate(sourceCode, [q1, fillTo3]);

Using build unpkg-module:

    <script src="qlcjs.min.js"></script>
    <script>
      const qlcs = qlcjs.generate(sourceCode, [
        { count: 1, types: ['FunctionName', 'ParameterName'] },
        { count: 3, fill: true, uniqueTypes: true }
      ]);
      qlcs.forEach(qlc => {
        console.log(qlc.type);
        console.log(qlc.question);
        console.log(qlc.options);
      });
    </script>

### References

The implementation was inspired by the work of Evan Cole on
[study-lenses](https://github.com/colevandersWands/study-lenses).

Analysis and transformations of the input programs depend on
[Shift tools](https://shift-ast.org/) by Shape Security, Inc.
These libraries are available under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0).

The concept of Questions About Learners' Code (QLCs) is first introduced by Lehtinen et al. in
[Let's Ask Students About Their Programs, Automatically](https://doi.org/10.1109/ICPC52881.2021.00054).
