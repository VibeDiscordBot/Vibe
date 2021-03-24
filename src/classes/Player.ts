import { Guild, TextChannel, VoiceChannel } from 'discord.js-light';
import Client from './Client';
import Queue from './Queue';
import Logger from './Logger';
import { getNotification, getSongEmbed } from '../helpers/embed';
import {
	DistortionValue,
	KaraokeValue,
	RotationValue,
	ShoukakuPlayer,
	ShoukakuSocket,
	TimescaleValue,
	TremoloValue,
	VibratoValue,
} from 'shoukaku';

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
}

export default class Player {
	public node: ShoukakuSocket;
	public player?: ShoukakuPlayer;

	private announce: TextChannel;

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
	}

	private async playNext() {
		const next = this.queue.next();
		if (next) {
			this.player = await this.player.playTrack(next);
			this.defineListeners();

			this.announce.send(getSongEmbed(next, this.bot.user, 'Now playing'));
		} else {
			this.announce.send(
				getNotification(
					'No more songs in queue\nDisconnecting and destroying the player',
					this.bot.user
				)
			);
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
		value = value < 0 ? null : value;
		switch (effect) {
			case AudioEffect.Distortion:
				{
					const v: DistortionValue = value
						? {
								scale: value,
						  }
						: null;
					this.player = await this.player.setDistortion(v);
				}
				break;
			case AudioEffect.Volume:
				{
					const v: number = value ? value : 1;
					this.player = await this.player.setVolume(v);
				}
				break;
			case AudioEffect.Karaoke:
				{
					const v: KaraokeValue = value
						? {
								level: value,
						  }
						: null;
					this.player = await this.player.setKaraoke(v);
				}
				break;
			case AudioEffect.Rotation:
				{
					const v: RotationValue = value
						? {
								rotationHz: value,
						  }
						: null;
					this.player = await this.player.setRotation(v);
				}
				break;
			case AudioEffect.Timescale:
				{
					const v: TimescaleValue = value
						? {
								speed: value,
						  }
						: {
								speed: 1,
						  };
					this.player = await this.player.setTimescale(v);
				}
				break;
			case AudioEffect.Tremolo:
				{
					const v: TremoloValue = value
						? {
								frequency: value,
						  }
						: null;
					this.player = await this.player.setTremolo(v);
				}
				break;
			case AudioEffect.Vibrato:
				{
					const v: VibratoValue = value
						? {
								frequency: value,
						  }
						: null;
					this.player = await this.player.setVibrato(v);
				}
				break;
			case AudioEffect.Nightcore:
				{
					const v: TimescaleValue = value
						? {
								pitch: 1.25,
								rate: 1.25,
						  }
						: null;
					this.player = await this.player.setTimescale(v);
				}
				break;
		}
	}
}
