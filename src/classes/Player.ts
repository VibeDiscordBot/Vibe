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

import { Guild, TextChannel, VoiceChannel } from 'discord.js-light';
import Client from './Client';
import Queue from './Queue';
import Logger from './Logger';
import { getNotification, getSongEmbed } from '../helpers/embed';
import { ShoukakuPlayer, ShoukakuSocket } from 'shoukaku';
import { PlayerSchema } from '../schemas/player';
import wait from '../helpers/wait';

export enum AudioEffect {
	Distortion,
	Volume,
	Karaoke,
	Rotation,
	Timescale,
	Tremolo,
	Vibrato,

	//Timescale Based audio effects
	Nightcore,

	//EQ Based audio effects
	Bass,
}

function getNumberInBounds(
	source: number,
	min: number,
	max: number,
	belowMinIsNull = false
): number {
	if (source < min) return belowMinIsNull ? null : min;
	if (source > max) return max;
	return source;
}

export default class Player {
	public node: ShoukakuSocket;
	public player?: ShoukakuPlayer;

	private announce: TextChannel;

	private willPushToDb = {
		willPush: false,
		lock: false,
	};

	constructor(protected bot: Client, public guild: Guild, public queue: Queue) {
		this.node = this.bot.shoukaku.getNode();
	}

	private defineListeners() {
		this.player.removeAllListeners();
		this.player.once('error', () => {
			this.player.disconnect();
			this.announce.send(
				getNotification(
					'An error occured\nDisconnecting and destroying the player',
					this.bot.user
				)
			);
		});
		this.player.once('end', () => {
			this.playNext();
		});
		this.player.once('nodeDisconnect', () => {
			delete this.player;
		});
	}

	public async connect(channel: VoiceChannel) {
		this.player = await this.node.joinVoiceChannel({
			guildID: this.guild.id,
			voiceChannelID: channel.id,
			deaf: true,
		});
		this.defineListeners();

		this.requestSync();
	}

	private async playNext() {
		const next = this.queue.next();
		if (next) {
			this.player = await this.player.playTrack(next);
			this.defineListeners();

			this.announce.send(getSongEmbed(next, this.bot.user, 'Now playing'));

			this.requestSync();
		} else {
			this.announce.send(
				getNotification(
					'No more songs in queue\nDisconnecting and destroying the player',
					this.bot.user
				)
			);

			this.disconnect();
		}
	}

	public disconnect() {
		Logger.info(
			`Disconnecting from ${this.player.voiceConnection.guildID}:${this.player.voiceConnection.voiceChannelID}`
		);
		this.announce.send(
			getNotification('Disconnecting and destroying the player', this.bot.user)
		);
		this.player.disconnect();

		this.requestSync();
	}

	public play() {
		if (!this.queue.current) {
			this.playNext();
		}
	}

	public setAnnounce(announce: TextChannel) {
		this.announce = announce;
	}

	public skip(amount: number) {
		for (let i = 0; i < amount - 1; i++) {
			if (!this.queue.next(true)) this.disconnect();
		}
		if (this.player) {
			this.playNext();
		} else {
			if (!this.queue.next(true)) this.disconnect();
		}
	}

	public async setEffect(effect: AudioEffect, value: number) {
		switch (effect) {
			case AudioEffect.Distortion:
				this.player = await this.player.setDistortion({
					scale: getNumberInBounds(value, 1, 10, true),
				});
				break;
			case AudioEffect.Volume:
				this.player = await this.player.setVolume(
					getNumberInBounds(value, 0, 10)
				);
				break;
			case AudioEffect.Karaoke:
				this.player = await this.player.setKaraoke({
					level: getNumberInBounds(value, 1, 10, true),
				});
				break;
			case AudioEffect.Rotation:
				this.player = await this.player.setRotation({
					rotationHz: getNumberInBounds(value, 0.1, 1, true),
				});
				break;
			case AudioEffect.Timescale:
				this.player = await this.player.setTimescale({
					speed: getNumberInBounds(value, 1, 10),
				});
				break;
			case AudioEffect.Tremolo:
				this.player = await this.player.setTremolo({
					frequency: getNumberInBounds(value, 0.1, 14, true),
				});
				break;
			case AudioEffect.Vibrato:
				this.player = await this.player.setVibrato({
					frequency: getNumberInBounds(value, 1, 25, true),
				});
				break;
			case AudioEffect.Nightcore:
				this.player = await this.player.setTimescale(
					value < 1
						? null
						: {
								pitch: 1.25,
								rate: 1.25,
						  }
				);
				break;
			case AudioEffect.Bass:
				{
					const val = getNumberInBounds(value, 1, 12, true);
					this.player = await this.player.setEqualizer(
						val
							? [
									{
										band: 0,
										gain: value / 4,
									},
									{
										band: 1,
										gain: value / 4,
									},
									{
										band: 2,
										gain: value / 4,
									},
							  ]
							: []
					);
				}
				break;
		}
	}

	get connected(): boolean {
		if (!this.player) return false;
		if (!this.player.voiceConnection) return false;

		if (this.player.voiceConnection.state === 'CONNECTED') return true;
		return false;
	}

	get channel(): VoiceChannel {
		if (!this.player) return null;
		if (!this.player.voiceConnection) return null;
		return this.bot.guilds
			.forge(this.player.voiceConnection.guildID)
			.channels.forge(this.player.voiceConnection.voiceChannelID, 'voice');
	}

	public update() {
		if (this.channel.members.size < 2) {
			this.disconnect();
		}
	}

	private async pushToDb() {
		this.willPushToDb.lock = true;

		const collection = this.bot.db.getCollection('Player', PlayerSchema);
		await this.bot.db.setById(collection, this.guild.id, {
			_id: this.guild.id,
			channelId: this.channel?.id || null,
			loop: this.queue.getLoop(),
			queue: [
				this.queue.current || null,
				this.queue.getQueue().map(
					(track) =>
						(track = <any>{
							name: track.info.title,
							author: track.info.author,
							duration: track.info.length,
							url: track.info.uri,
						})
				),
			].filter((el) => el != null),
			status: this.player?.voiceConnection?.state || 'NULL',
		});

		this.willPushToDb.willPush = false;
		this.willPushToDb.lock = false;
	}

	public async requestSync() {
		if (!this.willPushToDb.willPush) {
			this.willPushToDb.willPush = true;

			if (!this.willPushToDb.lock) {
				this.pushToDb();
			} else {
				while (this.willPushToDb.lock) {
					await wait(500);
				}
				this.pushToDb();
			}
		}
	}
}
