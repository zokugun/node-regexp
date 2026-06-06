export enum TokenType {
	ALTERNATE = 'alternate',
	ANY = 'any',
	BACK_REFERENCE = 'back-reference',
	BACKSPACE = 'backspace',
	BEGIN = 'begin',
	CAPTURE_GROUP = 'capture-group',
	CARRIAGE_RETURN = 'carriage-return',
	CHARSET = 'charset',
	CONTROL = 'control',
	DIGIT = 'digit',
	END = 'end',
	ESCAPE = 'escape',
	FORM_FEED = 'form-feed',
	HEX = 'hex',
	LINE_FEED = 'line-feed',
	LITERAL = 'literal',
	MATCH = 'match',
	MODIFIED_GROUP = 'modified-group',
	MODIFIER = 'modifier',
	NAMED_BACK_REFERENCE = 'named-back-reference',
	NAMED_GROUP = 'named-group',
	NEGATIVE_LOOKAHEAD = 'negative-lookahead',
	NEGATIVE_LOOKBEHIND = 'negative-lookbehind',
	NON_CAPTURE_GROUP = 'non-capture-group',
	NON_DIGIT = 'non-digit',
	NON_UNICODE_PROPERTY = 'non-unicode-property',
	NON_WHITE_SPACE = 'non-white-space',
	NON_WORD = 'non-word',
	NON_WORD_BOUNDARY = 'non-word-boundary',
	NUL = 'nul',
	OCTAL = 'octal',
	PATTERN = 'pattern',
	POSITIVE_LOOKAHEAD = 'positive-lookahead',
	POSITIVE_LOOKBEHIND = 'positive-lookbehind',
	QUANTIFIED = 'quantified',
	QUANTIFIER = 'quantifier',
	RANGE = 'range',
	TAB = 'tab',
	UNICODE = 'unicode',
	UNICODE_PROPERTY = 'unicode-property',
	UTF16 = 'utf-16',
	VERTICAL_TAB = 'vertical-tab',
	WHITE_SPACE = 'white-space',
	WORD = 'word',
	WORD_BOUNDARY = 'word-boundary',
}

export enum Flavor {
	ES2018 = 'es2018',
}

export type Modifiers = {
	positive: string[];
	negative: string[];
};

export type BaseToken = {
	type: TokenType;
	body?: Token | Token[];
};

export type AlternateToken = BaseToken & {
	type: TokenType.ALTERNATE;
	body: Token[];
};

export type AnyToken = BaseToken & {
	type: TokenType.ANY;
};

export type BackReferenceToken = BaseToken & {
	type: TokenType.BACK_REFERENCE;
	code: string;
};

export type BackspaceToken = BaseToken & {
	type: TokenType.BACKSPACE;
};

export type BeginToken = BaseToken & {
	type: TokenType.BEGIN;
};

export type CaptureGroupToken = BaseToken & {
	type: TokenType.CAPTURE_GROUP;
	body: Token;
};

export type CarriageReturnToken = BaseToken & {
	type: TokenType.CARRIAGE_RETURN;
};

export type CharsetToken = BaseToken & {
	type: TokenType.CHARSET;
	body: Token[];
	negated?: boolean;
};

export type ControlToken = BaseToken & {
	type: TokenType.CONTROL;
	code: string;
};

export type DigitToken = BaseToken & {
	type: TokenType.DIGIT;
};

export type EndToken = BaseToken & {
	type: TokenType.END;
};

export type EscapeToken = BaseToken & {
	type: TokenType.ESCAPE;
	code: string;
};

export type FormFeedToken = BaseToken & {
	type: TokenType.FORM_FEED;
};

export type HexToken = BaseToken & {
	type: TokenType.HEX;
	code: string;
};

export type LineFeedToken = BaseToken & {
	type: TokenType.LINE_FEED;
};

export type LiteralToken = BaseToken & {
	type: TokenType.LITERAL;
	text: string;
};

export type MatchToken = BaseToken & {
	type: TokenType.MATCH;
	body: Token[];
};

export type ModifiedGroupToken = BaseToken & {
	type: TokenType.MODIFIED_GROUP;
	modifiers: Modifiers;
	body: Token;
};

export type ModifierToken = BaseToken & {
	type: TokenType.MODIFIER;
	positive: string[];
	negative: string[];
};

export type NamedBackReferenceToken = BaseToken & {
	type: TokenType.NAMED_BACK_REFERENCE;
	name: string;
};

export type NamedGroupToken = BaseToken & {
	type: TokenType.NAMED_GROUP;
	name: string;
	body: Token;
};

export type NegativeLookaheadToken = BaseToken & {
	type: TokenType.NEGATIVE_LOOKAHEAD;
	body: Token;
};

export type NegativeLookbehindToken = BaseToken & {
	type: TokenType.NEGATIVE_LOOKBEHIND;
	body: Token;
};

export type NonCaptureGroupToken = BaseToken & {
	type: TokenType.NON_CAPTURE_GROUP;
	body: Token;
};

export type NonDigitToken = BaseToken & {
	type: TokenType.NON_DIGIT;
};

export type NonUnicodePropertyToken = BaseToken & {
	type: TokenType.NON_UNICODE_PROPERTY;
	property: string;
};

export type NonWhiteSpaceToken = BaseToken & {
	type: TokenType.NON_WHITE_SPACE;
};

export type NonWordToken = BaseToken & {
	type: TokenType.NON_WORD;
};

export type NonWordBoundaryToken = BaseToken & {
	type: TokenType.NON_WORD_BOUNDARY;
};

export type NulToken = BaseToken & {
	type: TokenType.NUL;
};

export type OctalToken = BaseToken & {
	type: TokenType.OCTAL;
	code: string;
};

export type PatternToken = BaseToken & {
	type: TokenType.PATTERN;
	body: Token;
	modifiers?: Modifiers;
};

export type PositiveLookaheadToken = BaseToken & {
	type: TokenType.POSITIVE_LOOKAHEAD;
	body: Token;
};

export type PositiveLookbehindToken = BaseToken & {
	type: TokenType.POSITIVE_LOOKBEHIND;
	body: Token;
};

export type QuantifiedToken = BaseToken & {
	type: TokenType.QUANTIFIED;
	body: Token;
	quantifier: QuantifierToken;
};

export type QuantifierToken = BaseToken & {
	type: TokenType.QUANTIFIER;
	min: number;
	max: number;
};

export type RangeToken = BaseToken & {
	type: TokenType.RANGE;
	begin: Token;
	end: Token;
};

export type TabToken = BaseToken & {
	type: TokenType.TAB;
};

export type UnicodeToken = BaseToken & {
	type: TokenType.UNICODE;
	code: string;
};

export type UnicodePropertyToken = BaseToken & {
	type: TokenType.UNICODE_PROPERTY;
	property: string;
};

export type Utf16Token = BaseToken & {
	type: TokenType.UTF16;
	code: string;
};

export type VerticalTabToken = BaseToken & {
	type: TokenType.VERTICAL_TAB;
};

export type WhiteSpaceToken = BaseToken & {
	type: TokenType.WHITE_SPACE;
};

export type WordToken = BaseToken & {
	type: TokenType.WORD;
};

export type WordBoundaryToken = BaseToken & {
	type: TokenType.WORD_BOUNDARY;
};

export type Token =
	| AlternateToken
	| AnyToken
	| BackReferenceToken
	| BackspaceToken
	| BeginToken
	| CaptureGroupToken
	| CarriageReturnToken
	| CharsetToken
	| ControlToken
	| DigitToken
	| EndToken
	| EscapeToken
	| FormFeedToken
	| HexToken
	| LineFeedToken
	| LiteralToken
	| MatchToken
	| ModifiedGroupToken
	| ModifierToken
	| NamedBackReferenceToken
	| NamedGroupToken
	| NegativeLookaheadToken
	| NegativeLookbehindToken
	| NonCaptureGroupToken
	| NonDigitToken
	| NonUnicodePropertyToken
	| NonWhiteSpaceToken
	| NonWordToken
	| NonWordBoundaryToken
	| NulToken
	| OctalToken
	| PatternToken
	| PositiveLookaheadToken
	| PositiveLookbehindToken
	| QuantifiedToken
	| QuantifierToken
	| RangeToken
	| TabToken
	| UnicodeToken
	| UnicodePropertyToken
	| Utf16Token
	| VerticalTabToken
	| WhiteSpaceToken
	| WordToken
	| WordBoundaryToken;

export type Visitor = (token: Token) => void;
export type Transformer = (token: Token, parent: Token | null, key: string | null, index: number | null) => void;
