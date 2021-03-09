type Track = {
	url: string;
	name: string;
	author: string;
	duration: number;
};

export default class Queue {
	private queue: Track[] = [];

	public getQueue(): Track[] {
		return this.queue;
	}

	public next(): Track | null {
		if (this.queue.length < 1) return null;
		return this.queue.shift();
	}

	public add(track: Track) {
		this.queue.push(track);
	}

	public toObject(): Array<Object> {
		return (() => {
			const result = []

			this.queue.forEach(entry => {
				result.push({
					name: entry.name,
					author: entry.author,
					duration: entry.duration,
					url: entry.url
				})
			})

			return result
		})()
	}
}
