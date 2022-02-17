/// <reference types="node" />

declare module 'shift-parser' {
  import { Module, Node, Script } from 'shift-ast';

  export function parseModule(source: string, opt?: ParseOptions): Module;
  export function parseScript(source: string, opt?: ParseOptions): Script;
  export default function parse(source: string, opt?: ParseOptions): Script;

  export function parseModuleWithLocation(
    source: string,
    opt?: ParseOptions,
  ): {
    tree: Module;
    locations: LocationMap;
    comments: Comment[];
  };

  export function parseScriptWithLocation(
    source: string,
    opt?: ParseOptions,
  ): {
    tree: Script;
    locations: LocationMap;
    comments: Comment[];
  };

  export interface ParseOptions {
    earlyErrors?: boolean;
  }

  export type LocationMap = Map<Node, SourceRange>;

  export interface Comment extends SourceRange {
    text: string;
    type: 'SingleLine' | 'HTMLOpen' | 'HTMLClose' | 'MultiLine';
  }

  export interface SourceRange {
    start: SourceLocation;
    end: SourceLocation;
  }

  export interface SourceLocation {
    line: number;
    column: number;
    offset: number;
  }
}
