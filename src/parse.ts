import { isRegExp } from '@zokugun/is-it-type';
import { pegParse } from './generated/parser.js';
import { type Token } from './types.js';

export function parse(value: string | RegExp): Token {
	if(typeof value === 'string') {
		return pegParse(value);
	}
	else if(isRegExp(value)) {
		return pegParse(value.toString());
	}
	else {
		throw new TypeError('The regexp to parse must be represented as a string.');
	}
}
