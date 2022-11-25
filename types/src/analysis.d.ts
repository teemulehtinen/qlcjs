import { Node } from 'estree';
export declare const extractNaming: (ast: Node) => {
    functions: Set<string>;
    variables: Set<string>;
    keywords: Set<string>;
};
export default extractNaming;
