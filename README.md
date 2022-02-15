# qlcjs

Generates questions about concrete constructs and patterns in a given JavaScript program.
These questions--including answering options--can be posed to a learner to practice
introductory programming. These questions include elements that train program comprehension
and program tracing.

Automatic generation of these questions enable systems to pose these questions to the leaner
about their own program that they just programmed. Such Questions About Learners' Code (QLCs)
may have reflection and self-explanation effects that are of interest in computing education
research.

### References

The concept of Questions About Learners' Code (QLCs) is first introduced by Lehtinen et al. in
[Let's Ask Students About Their Programs, Automatically](https://doi.org/10.1109/ICPC52881.2021.00054).

The implementation for JavaScript using [Acorn](https://github.com/acornjs/acorn)
is based on work by Evan Cole for [study-lenses](https://github.com/colevandersWands/study-lenses).
