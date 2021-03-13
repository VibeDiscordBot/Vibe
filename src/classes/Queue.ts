import { Guild } from 'discord.js-light';
import Client from './Client';
import * as playerSchema from '../schemas/player';

export type Track = {
	url: string;
	name: string;
	author: string;
	duration: number;
};

export default class Queue {
	private queue: Track[] = [];

	constructor(private bot: Client, public guild: Guild) {}

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
			const result = [];

			this.queue.forEach((entry) => {
				result.push({
					name: entry.name,
					author: entry.author,
					duration: entry.duration,
					url: entry.url,
				});
			});

			return result;
		})();
	}

	public async getFromDb() {
		const playerModel = this.bot.db.model('Player', playerSchema.default);

		const ref = await playerModel.findOne({
			guild: this.guild.id,
		});

		if (ref) {
			(<any>ref).queue.forEach((entry) => {
				this.add({
					name: entry.name,
					author: entry.author,
					duration: entry.duration,
					url: entry.url,
				});
			});
		}
	}

	public clear() {
		this.queue = [];
	}
}
