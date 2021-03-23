import { Guild, TextChannel, VoiceChannel } from 'discord.js-light';
import Client from './Client';
import Queue from './Queue';
import Logger from './Logger';
import { getNotification, getSongEmbed } from '../helpers/embed';
import { ShoukakuPlayer, ShoukakuSocket } from 'shoukaku';

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
}
