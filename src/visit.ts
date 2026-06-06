import { type Token, type TokenType, type Visitor } from './types.js';

export function visit(tokens: Token | Token[] | undefined, callback?: Visitor | Partial<Record<TokenType, Visitor>>): void {
	if(typeof callback === 'function') {
		visitFunc(tokens, callback);
	}
	else if(callback) {
		visitMap(tokens, callback);
	}
}

function visitFunc(tokens: Token | Token[] | undefined, callback: Visitor) {
	if(Array.isArray(tokens)) {
		for(const token of tokens) {
			callback(token);

			if('body' in token && token.body) {
				visitFunc(token.body, callback);
			}
		}
	}
	else if(tokens) {
		callback(tokens);

		if('body' in tokens && tokens.body) {
			visitFunc(tokens.body, callback);
		}
	}
}

function visitMap(tokens: Token | Token[] | undefined, callbackMap: Partial<Record<TokenType, Visitor>>) {
	visitFunc(tokens, (token: Token) => {
		const fn = callbackMap[token.type];
		if(fn) {
			fn(token);
		}
	});
}
