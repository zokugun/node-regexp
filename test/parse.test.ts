import fse from '@zokugun/fs-extra-plus/sync';
import { xtry } from '@zokugun/xtry/sync';
import { expect, it } from 'vitest';
import YAML from 'yaml';
import { parse, type Token } from '../src/index.js';

const ROOT = fse.join('.', 'test', 'fixtures', 'parse');

const files = fse.walk(ROOT, {
	absolute: true,
	onlyFiles: true,
	collect: true,
	filter: (item) => fse.leafExt(item.path) === '.yml',
});

if(files.fails) {
	throw files.error;
}

for(const file of files.value) {
	const name = fse.leafName(file.path, '.yml');

	it(name, () => {
		const content = fse.readFile(file.path, 'utf8');
		if(content.fails) {
			throw content.error;
		}

		const document = xtry(() => YAML.parse(content.value) as unknown);
		if(document.fails) {
			throw document.error;
		}

		const { regexp, ast } = document.value as { regexp: string; ast: Token };

		const data = parse(regexp);

		try {
			expect(data).to.eql(ast);
		}
		catch (error) {
			console.log(YAML.stringify(data));

			throw error;
		}
	});
}
