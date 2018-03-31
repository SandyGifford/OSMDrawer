import * as md5 from "md5";

export default class HashUtils {
	public static md5(str: string): string {
		return md5(str);
	}

	public static colorHash(str: string): string {
		const md5 = HashUtils.md5(str);
		return `#${md5.slice(0, 6)}`;
	}
}