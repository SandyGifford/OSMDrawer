export default class DomUtils {
	public static BemClassName(className: string, modifiers: {[modifier: string]: boolean}): string {
		return Object.keys(modifiers).reduce((classes, modifier) => {
			if (modifiers[modifier]) classes += ` ${className}--${modifier}`;
			return classes;
		}, className);
	}
}