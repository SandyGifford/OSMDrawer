export default class FetchUtils {
	public static fetchXML(input: RequestInfo, init?: RequestInit): Promise<XMLDocument> {
		return fetch(input, init)
			.then(response => response.text())
			.then(text => new DOMParser().parseFromString(text, "text/xml"));
	}

	public static printAndPass<T>(input: T): T {
		console.log(input);
		return input;
	}
}