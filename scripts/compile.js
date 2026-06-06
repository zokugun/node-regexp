import fse from '@zokugun/fs-extra-plus/sync';
import peg from 'pegjs';

const definitionFile = fse.resolve('.', 'src', 'grammar.pegjs');
const parserFile = fse.resolve('.', 'src', 'generated', 'parser.ts');

const content = fse.readFile(definitionFile, 'utf8');
if(content.fails) {
	throw content.error;
}

let output = peg.generate(content.value, {
	output: 'source',
	format: 'commonjs',
});

output = output
	.replace('"use strict";', 'import { Token, TokenType } from \'../types.js\';')
	.replaceAll('this.', '// @ts-ignore\n  this.')
	.replace('const body = []', 'const body: any[] = []')
	.replace('Error.captureStackTrace(this,', '// @ts-ignore\n    Error.captureStackTrace(this,')
	.replaceAll(/( *)function (text|location|expected|error)\(/g, (match, indent) => `${indent}// @ts-ignore\n${match}`)
	.replace('peg$maxFailExpected  = [],', 'peg$maxFailExpected: any[] = [],')
	.replaceAll(/( *)var s0, s1;/g, (match, indent) => `${indent}// @ts-ignore\n${match}`)
	.replace(/module\.exports[\s\S]*};/, 'export const pegParse = peg$parse as (s: string) => Token;');

const mkResult = fse.mkdirs(fse.parentPath(parserFile));
if(mkResult.fails) {
	throw mkResult.error;
}

const writeResult = fse.writeFile(parserFile, output, 'utf8');
if(writeResult.fails) {
	throw writeResult.error;
}

console.log(`Generate to ${parserFile}`);
