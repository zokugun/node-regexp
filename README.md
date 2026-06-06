[@zokugun/regexp](https://github.com/zokugun/node-regexp)
=========================================================

[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@zokugun/regexp.svg?colorB=green)](https://www.npmjs.com/package/@zokugun/regexp)
[![Donation](https://img.shields.io/badge/donate-ko--fi-green)](https://ko-fi.com/daiyam)
[![Donation](https://img.shields.io/badge/donate-liberapay-green)](https://liberapay.com/daiyam/donate)
[![Donation](https://img.shields.io/badge/donate-paypal-green)](https://paypal.me/daiyam99)

With `@zokugun/regexp`, you can parse a regular expression to get an AST. Then you can visit, transform or/and translate the ast. When you have finished your edits, you can stringify the AST to get a string to create a `RegExp`.

Features
--------

- Parse a regular expression into a detailed AST.
- Visit and transform AST nodes.
- Translate regexps between flavors (for example, `ES2018`).
- Stringify an AST back to a RegExp string.
- Escape RegExp special characters in strings.

Installation
------------

```bash
npm add @zokugun/regexp
```

Quick Start
-----------

```typescript
import { escape, parse, stringify, translate, visit, Flavor, Token, TokenType } from '@zokugun/regexp'

function listCaptureGroups(regex: string): Token[] {
    const ast = parse(regex);

    const groups: Token[] = [];

    visit(ast.body, {
        [TokenType.CAPTURE_GROUP](token) {
            groups.push(token);
        }
    });

    return groups;
}

function toES2018(source: string): RegExp {
    return new RegExp(translate(source, Flavor.ES2018));
}
```

Syntax
------

The library is supporting ES2018 syntax and some elements of PCRE2 syntax.

| Characters / constructs                                                                                                      | Corresponding article                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `\`, `.`, `\cX`, `\d`, `\D`, `\f`, `\n`, `\r`, `\s`, `\S`, `\t`, `\v`, `\w`, `\W`, `\0`, `\xhh`, `\uhhhh`, `\uhhhhh`, `[\b]` | [Character classes (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes)              |
| `^`, `$`, `x(?=y)`, `x(?!y)`, `(?<=y)x`, `(?<!y)x`, `\b`, `\B`                                                               | [Assertions (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions)                            |
| `(x)`, `(?:x)`, `(?<Name>x)`, `x\|y`, `[xyz]`, `[^xyz]`, `\Number`                                                           | [Groups and ranges (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Ranges)              |
| `*`, `+`, `?`, `x{n}`, `x{n,}`, `x{n,m}`                                                                                     | [Quantifiers (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Quantifiers)                          |
| `\p{UnicodeProperty}`, `\P{UnicodeProperty}`                                                                                 | [Unicode property escapes (MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes) |
| `(?imsxUJX-imsxUJX)x`, `(?i:x)y`                                                                                             | [Option Setting (PCRE)](https://mariadb.com/kb/en/pcre/#option-setting)                                                                     |

API reference
-------------

### parse(value: string | RegExp) => Token

with `interface Token`, parse the `value` to generate an AST tree.

### stringify(tokens?: Token | Token[] | RegExp) => string

generate a string based on the given AST tokens.

### visit(tokens?: Token | Token[], callback?: { [TokenType: string]: Visitor } | Visitor) => void

with `type Visitor = (token: Token) => void`, call the `callback` when iterating the given AST tokens

### transform(tokens?: Token | Token[], callback?: { [TokenType: string]: Transformer } | Transformer) => void

with `type Transformer = (token: Token, parent: Token | null, key: string | null, index: number | null) => void`, call the `callback` when iterating the given AST tokens.
The `this` context of the `callback` with have the following functions:

- `this.remove() => void`: remove the current token
- `this.replace(token: string | Token | Token[], transform?: boolean) => void`: replace the current token with the given token(s). If `transform` is true, then the new token(s) are going to be transformed.
- `this.transform(tokens: Token | Token[], parent?: Token, key?: string) => void`: run the tranformation on the given token(s).

### translate(value: string | RegExp | Token | Token[], target: Flavor, toString?: boolean = true) => string | Token | Token[]

translate a regex for the `target` regexp language.

```typescript
function toES2018(source: string): RegExp {
    return new RegExp(translate(source, Flavor.ES2018));
}
```

| Supported Flavors |
| ----------------- |
| `ES2018`          |

### escape(value: string) => string

escape the RegExp special characters from the `value`.

Contributions
-------------

Contributions are most welcome. Please:
- Open issues and feature requests under the repository discussions.
- Follow the [`CONTRIBUTING.md`](./CONTRIBUTING.md).

Donations
---------

Support this project by becoming a financial contributor.

<table>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_kofi.png" alt="Ko-fi" width="80px" height="80px"></td>
        <td><a href="https://ko-fi.com/daiyam" target="_blank">ko-fi.com/daiyam</a></td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_liberapay.png" alt="Liberapay" width="80px" height="80px"></td>
        <td><a href="https://liberapay.com/daiyam/donate" target="_blank">liberapay.com/daiyam/donate</a></td>
    </tr>
    <tr>
        <td><img src="https://raw.githubusercontent.com/daiyam/assets/master/icons/256/funding_paypal.png" alt="PayPal" width="80px" height="80px"></td>
        <td><a href="https://paypal.me/daiyam99" target="_blank">paypal.me/daiyam99</a></td>
    </tr>
</table>

License
-------

Copyright &copy; 2021-present Baptiste Augrain

Licensed under the [MIT license](https://opensource.org/licenses/MIT).
