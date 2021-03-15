import { Guild } from 'discord.js-light';
import Client from './Client';
import * as playerSchema from '../schemas/player';

export type Track = {
	url: string;
	name: string;
	author: string;
	duration: number;
};

export enum Loop {
	LoopTrack,
	NoLoop,
	LoopQueue,
}

export default class Queue {
	private queue: Track[] = [];
	private loop: Loop = Loop.NoLoop;

	constructor(private bot: Client, public guild: Guild) {}

	public getQueue(): Track[] {
		return this.queue;
	}

	public next(force = false): Track | null {
		if (this.queue.length < 1) return null;

		if (force || this.loop === Loop.NoLoop) {
			return this.queue.shift();
		} else if (this.loop === Loop.LoopQueue) {
			const track = this.queue.shift();
			this.queue.push(track);
			return track;
		} else if (this.loop === Loop.LoopTrack) {
			return this.queue[0];
		}
	}

	public add(track: Track) {
		this.queue.push(track);
	}

	public toObject(): {
		queue: Array<Object>;
		loop: number;
	} {
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

			return {
				queue: result,
				loop: this.loop,
			};
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
			this.loop = (<any>ref).loop;
		}
	}

	public clear() {
		this.queue = [];
	}

	public getLoop() {
		return this.loop;
	}

	public setLoop(loop: Loop) {
		this.loop = loop;
	}
}
