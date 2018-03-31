declare module 'color-hash' {
	export default class ColorHash {
		public hsl(str: string): [number, number, number];
		public rgb(str: string): [number, number, number];
		public hex(str: string): string;
	}
}