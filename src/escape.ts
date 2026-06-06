const ESCAPE_REGEX = /[-|\\{}()[\]^$+*?.]/g;

export function escape(value: string): string {
	return value.replaceAll(ESCAPE_REGEX, '\\$&');
}
