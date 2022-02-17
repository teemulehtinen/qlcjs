# qlcjs

Generates questions about concrete constructs and patterns in a given JavaScript program.
These questions–including answering options–can be posed to a learner to practice
introductory programming. These questions include elements to develop program comprehension
and program tracing.

Automatic generation enables systems to pose the generated questions to leaners
about their own programs that they just programmed. Such Questions About Learners' Code (QLCs)
may have self-reflection and self-explanation effects that are of interest
in computing education research.

### References

The implementation was inspired by the work on
[study-lenses](https://github.com/colevandersWands/study-lenses) by Evan Cole.

Analysis and transformations of the input programs depend on
[Shift tools](https://shift-ast.org/) by Shape Security, Inc. (Apache License, Version 2.0)

The concept of Questions About Learners' Code (QLCs) is first introduced by Lehtinen et al. in
[Let's Ask Students About Their Programs, Automatically](https://doi.org/10.1109/ICPC52881.2021.00054).
