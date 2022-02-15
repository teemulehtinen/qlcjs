import { Node } from 'estree';
import { walk } from './walker';

export const extractNaming = (ast: Node) => {
	const functions = new Set<string>([]);
	const variables = new Set<string>([]);
	const keywords = new Set<string>([]);
	walk(ast, node => {
		switch (node.type) {
			case 'FunctionDeclaration':
				keywords.add('function');
				if (node.id) {
					functions.add(node.id.name);
				}
				break;
			case 'VariableDeclaration':
				keywords.add(node.kind);
				node.declarations.forEach(d => {
					if (d.id.type === 'Identifier') {
						variables.add(d.id.name);
					}
				});
				break;
			case 'ForStatement':
				keywords.add('for');
				break;
			case 'ReturnStatement':
				keywords.add('return');
				break;
			default:
				break;
		}
	});
	return { functions, variables, keywords };
};

export default extractNaming;
