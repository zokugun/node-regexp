import { isRegExp, isString } from '@zokugun/is-it-type';
import { parse } from './parse.js';
import { stringify } from './stringify.js';
import { type TransformContext, transform } from './transform.js';
import { TokenType, Flavor, type Token } from './types.js';

type Translator = (t: string | Token | Token[]) => Token;

const TRANSLATORS: Partial<Record<Flavor, Translator>> = {
	[Flavor.ES2018]: translateES2018,
};

export function translate(value: string | RegExp | Token | Token[], target: Flavor, toString?: true): string;
export function translate(value: Token[], target: Flavor, toString: false): Token[];
export function translate(value: string | RegExp | Token, target: Flavor, toString: false): Token;
export function translate(value: string | RegExp | Token | Token[], target: Flavor, toString: boolean = true): string | Token | Token[] {
	const translator = TRANSLATORS[target];

	if(!translator) {
		if(typeof value === 'string') {
			return value;
		}

		if(isRegExp(value)) {
			return value.toString();
		}

		return value;
	}

	let result: Token | Token[];

	if(Array.isArray(value)) {
		result = [];

		for(const item of value) {
			result.push(translator(item));
		}
	}
	else if(isRegExp(value) || isString(value)) {
		result = translator(parse(value));
	}
	else {
		result = translator(value);
	}

	if(toString) {
		return stringify(result);
	}
	else {
		return result;
	}
}

function translateES2018(ast: string | Token | Token[]): Token {
	const astToken = ast as Token;
	let caseless = false;
	let inCharset = false;
	let sets: Record<string, boolean> | null = null;

	transform(astToken, {
		[TokenType.CHARSET]: function (this: TransformContext, token: Token) {
			const charset = token as { body?: Token | Token[] };

			inCharset = true;
			sets = {};

			this.transform(charset.body, token, 'body');

			inCharset = false;
		},
		[TokenType.LITERAL]: function (this: TransformContext, token: Token) {
			const literal = token as { type: TokenType.LITERAL; text: string };

			if(caseless) {
				let text = '';
				let upper: string | undefined;
				let lower: string | undefined;
				let upperLower: string | undefined;

				for(const c of literal.text.split('')) {
					upper = c.toUpperCase();
					lower = c.toLowerCase();

					if(upper === lower) {
						text += upper;
					}
					else {
						upperLower = `${upper}${lower}`;

						if(inCharset) {
							if(!sets![upperLower]) {
								sets![upperLower] = true;

								text += upperLower;
							}
						}
						else {
							text += `[${upperLower}]`;
						}
					}
				}

				if(literal.text !== text) {
					this.replace(text);
				}
			}
		},
		[TokenType.MODIFIED_GROUP]: function (this: TransformContext, token: Token) {
			const modifier = token as { modifiers: { positive: string[]; negative: string[] }; body: Token };

			if(modifier.modifiers.positive.includes('i')) {
				caseless = true;
			}

			if(modifier.modifiers.negative.includes('i')) {
				caseless = false;
			}

			this.replace({
				type: TokenType.NON_CAPTURE_GROUP,
				body: modifier.body,
			} as Token, true);
		},
		[TokenType.MODIFIER]: function (this: TransformContext, token: Token) {
			const modifier = token as { positive: string[]; negative: string[] };
			if(modifier.positive.includes('i')) {
				caseless = true;
			}

			if(modifier.negative.includes('i')) {
				caseless = false;
			}

			this.remove();
		},
		[TokenType.RANGE]: function (this: TransformContext, token: Token) {
			const range = token as { begin: Token; end: Token };

			if(caseless) {
				let beginUpper: string | undefined;
				let beginLower: string | undefined;

				if(range.begin.type === TokenType.LITERAL) {
					beginUpper = (range.begin as { text: string }).text.toUpperCase();
					beginLower = (range.begin as { text: string }).text.toLowerCase();
				}

				let endUpper: string | undefined;
				let endLower: string | undefined;

				if(range.end.type === TokenType.LITERAL) {
					endUpper = (range.end as { text: string }).text.toUpperCase();
					endLower = (range.end as { text: string }).text.toLowerCase();
				}

				if(beginUpper && endUpper && beginUpper !== beginLower && (beginUpper.codePointAt(0)! - endUpper.codePointAt(0)!) === (beginLower!.codePointAt(0)! - endLower!.codePointAt(0)!)) {
					const range = `${beginUpper}-${endUpper}${beginLower}-${endLower}`;

					if(sets![range]) {
						this.remove();
					}
					else {
						sets![range] = true;

						this.replace(range);
					}
				}
			}
		},
	});

	return astToken;
}
