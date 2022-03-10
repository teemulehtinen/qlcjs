export const TINY_FUNCTIONS = `
  function plusTwo(n) {
		let newValue = n + 2;
		return newValue;
	}
	
	const summer = (a, b) => a + b;

	const nested = function () {
		const a = 1;
		function b(i) {
			return i + 10;
		}
		return b(a);
	};
`;

export const BLA_CODE = `
	function bla(n) {
		const repeated = 'bla '.repeat(n);
		return repeated.trim();
	}
	let i;
	i = 5;
	while (i > 0) {
		const blabla = bla(i);
		console.log(blabla);
		i -= 1;
	}
`;

export const FOR_CODE = `
	function power(a, b) {
		let n = 1;
		for (let i = 0; i < b; i += 1) {
			n *= a;
		}
		return n;
	}
`;
