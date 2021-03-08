import 'colors';

export default class Logger {
	private static log(key: string, text: string) {
		console.log('['.bold + key + ']'.bold + ' ' + text);
	}

	public static info(text: string) {
		this.log('Info'.blue, text);
	}

	public static error(text: string) {
		this.log('Error'.red, text);
	}
}
