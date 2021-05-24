/*
    Copyright (C) 2021 Tijn Hoftijzer

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { ShoukakuTrack } from 'shoukaku';
import Player from './Player';
import _ from 'lodash';

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
		if (this.queue.length < 1) {
			this.clear();
			return null;
		}

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

		this.player?.requestSync();
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

	public async findFromHash(hash: string): Promise<ShoukakuTrack> {
		const decoded: any = await this.player.node.rest.decode(hash);
		return await (
			await this.player.node.rest.resolve(decoded.identifier)
		).tracks[0];
	}

	public shuffle() {
		this.queue = _.shuffle(this.queue);

		this.player?.requestSync();
	}
}
