import { Node } from 'shift-ast';
import { Transformer } from './transformChildren';
export { Transformer } from './transformChildren';
declare const transform: (parent: Node, tr: Transformer) => Node;
export default transform;
