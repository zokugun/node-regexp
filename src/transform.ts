import { parse } from './parse.js';
import { type Token, type TokenType, type Transformer } from './types.js';

export type TransformContext = {
	remove(): void;
	replace(token: Token | string | Token[], transform?: boolean): void;
	transform(tokensArg: Token | Token[] | undefined, parentArg: Token | null, keyArg: string | null): void;
};

export function transform(tokens: Token | Token[] | undefined, callback?: Transformer | Partial<Record<TokenType, Transformer>>): void {
	if(typeof callback === 'function') {
		transformFunc(tokens, null, null, callback);
	}
	else if(callback) {
		transformMap(tokens, callback);
	}
}

function transformFunc(tokens: Token | Token[] | undefined, parent: Token | null, key: string | null, callback: Transformer) {
	if(Array.isArray(tokens)) {
		let i = -1;
		let notSkipped = true;

		const that: TransformContext = {
			remove() {
				tokens.splice(i, 1);

				--i;

				notSkipped = false;
			},
			replace(token: Token | string | Token[], transform?: boolean) {
				let replacement: Token | Token[] | undefined;

				if(typeof token === 'string') {
					replacement = (parse(token) as { body?: Token | Token[] }).body!;
				}
				else {
					replacement = token;
				}

				if(Array.isArray(replacement)) {
					tokens.splice(i, 1, ...replacement);
				}
				else {
					tokens.splice(i, 1, replacement);
				}

				if(transform) {
					--i;
				}
				else if(Array.isArray(replacement)) {
					i += replacement.length - 1;
				}

				notSkipped = false;
			},
			transform(tokensArg: Token | Token[] | undefined, parentArg: Token | null, keyArg: string | null) {
				transformFunc(tokensArg, parentArg, keyArg, callback);

				notSkipped = false;
			},
		};

		while(++i < tokens.length) {
			const token = tokens[i];

			callback.call(that as unknown as ThisType<TransformContext>, token, parent, key, i);

			if(notSkipped) {
				if('body' in token && token.body) {
					transformFunc(token.body as Token | Token[] | undefined, token, 'body', callback);
				}
			}
			else {
				notSkipped = true;
			}
		}
	}
	else if(parent) {
		let notSkipped = true;

		const that: TransformContext = {
			remove() {
				if(parent && key) {
					delete (parent as unknown as Record<string, unknown>)[key];
				}

				notSkipped = false;
			},
			replace(token: Token | string | Token[], transform?: boolean) {
				let replacement: Token | Token[] | undefined;

				if(typeof token === 'string') {
					replacement = (parse(token) as { body?: Token | Token[] }).body!;
				}
				else {
					replacement = token;
				}

				if(parent && key) {
					(parent as unknown as Record<string, unknown>)[key] = replacement as unknown;
				}

				if(transform && replacement) {
					transformFunc(replacement as Token | Token[] | undefined, parent, key, callback);
				}

				notSkipped = false;
			},
			transform(tokensArg: Token | Token[] | undefined, parentArg: Token | null, keyArg: string | null) {
				transformFunc(tokensArg, parentArg, keyArg, callback);

				notSkipped = false;
			},
		};

		callback.call(that as unknown as ThisType<TransformContext>, tokens!, parent, key, null);

		if(notSkipped) {
			const maybeBody = (tokens as unknown as { body?: Token | Token[] }).body;
			if(maybeBody) {
				transformFunc(maybeBody as Token | Token[] | undefined, tokens!, 'body', callback);
			}
		}
		else {
			notSkipped = true;
		}
	}
	else {
		callback.call(null as unknown as ThisType<TransformContext>, tokens!, null, null, null);

		const maybeBody = (tokens as unknown as { body?: Token | Token[] }).body;
		if(maybeBody) {
			transformFunc(maybeBody as Token | Token[] | undefined, tokens!, 'body', callback);
		}
	}
}

function transformMap(tokens: Token | Token[] | undefined, callbackMap: Partial<Record<TokenType, Transformer>>) {
	transformFunc(tokens, null, null, function (this: TransformContext, token: Token, parent: Token | null, key: string | null, index: number | null) {
		const fn = callbackMap[token.type];
		if(fn) {
			fn.call(this as unknown as ThisType<TransformContext>, token, parent, key, index);
		}
	});
}
