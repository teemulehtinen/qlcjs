import { Node } from 'shift-ast';
import { LocationMap } from 'shift-parser';

export const getLine = (
  node: Node,
  locations: LocationMap,
  end?: boolean,
): number => {
  const r = locations.get(node);
  if (end) {
    return r ? r.end.line : 0;
  }
  return r ? r.start.line : 0;
};

export const getLines = (
  nodes: Node[],
  locations: LocationMap,
  end?: boolean,
): number[] => nodes.map(n => getLine(n, locations, end));
