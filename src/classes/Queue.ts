import { ShoukakuTrack } from 'shoukaku';
import Player from './Player';

export enum Loop {
	LoopTrack,
	NoLoop,
	LoopQueue,
}

export default class Queue {
	private queue: ShoukakuTrack[] = [];
	private loop: Loop = Loop.NoLoop;
	private player?: Player;

	public current?: ShoukakuTrack;

	public setPlayer(player: Player) {
		this.player = player;
	}

	public getQueue(): ShoukakuTrack[] {
		return this.queue;
	}

	private shift(): ShoukakuTrack | null {
		const track = this.queue.length > 0 ? this.queue.shift() : null;
		if (track) {
			this.current = track;
		} else {
			delete this.current;
		}
		return track;
	}

	private get(index: number): ShoukakuTrack | null {
		const track = this.queue[index] ? this.queue[index] : null;
		if (track) {
			this.current = track;
		} else {
			delete this.current;
		}
		return track;
	}

	public next(force = false): ShoukakuTrack | null {
		if (this.queue.length < 1) return null;

		if (force || this.loop === Loop.NoLoop) {
			return this.shift();
		} else if (this.loop === Loop.LoopQueue) {
			const track = this.shift();
			this.queue.push(track);
			return track;
		} else if (this.loop === Loop.LoopTrack) {
			return this.get(0);
		}
	}

	public add(track: ShoukakuTrack) {
		this.queue.push(track);
	}

	public async find(query: string): Promise<ShoukakuTrack | null> {
		const result = await this.player.node.rest.resolve(query, 'youtube');
		if (!result) return null;
		result.tracks.map(
			(track) => (track.info.length = Math.round(track.info.length / 1000))
		);
		const eligable = result.tracks.filter(
			(track) => track.info.length < 10 * 60
		);
		return eligable.length > 0 ? eligable[0] : null;
	}

	public clear() {
		this.current = null;
		this.queue = [];
	}

	public getLoop() {
		return this.loop;
	}

	public setLoop(loop: Loop) {
		this.loop = loop;
	}
}
