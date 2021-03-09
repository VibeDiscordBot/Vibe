import {
	StreamDispatcher,
	VoiceChannel,
	VoiceConnection,
} from 'discord.js-light';
import Client from './Client';
import Queue from './Queue';
import ytdl from 'ytdl-core-discord';
import Logger from './Logger';

export enum PlayerStatus {
	Playing,
	Paused,
	Connected,
	Disconnected,
	Destroyed,
}

export default class Player {
	public status: PlayerStatus = PlayerStatus.Disconnected;
	public channel: VoiceChannel;

	private connection: VoiceConnection;
	private dispatcher: StreamDispatcher;

	constructor(protected bot: Client, protected queue: Queue) {}

	public async connect(channel: VoiceChannel) {
		this.connection = await channel.join();
		this.channel = channel;

		this.status = PlayerStatus.Connected;
	}

	private async continue() {
		if (
			this.status === PlayerStatus.Connected ||
			this.status === PlayerStatus.Playing
		) {
			if (this.connection && this.connection.status === 0) {
				const next = this.queue.next();
				if (next) {
					this.dispatcher = this.connection.play(await ytdl(next.url), {
						type: 'opus',
						bitrate: this.channel.bitrate,
					});
					this.dispatcher.once('finish', () => {
						this.status = PlayerStatus.Connected;
						this.continue();
					});
					this.dispatcher.on('error', console.log);

					this.status = PlayerStatus.Playing;
				} else {
					this.destroy();
				}
			}
		}
	}

	public disconnect() {
		Logger.info(
			`Disconnecting from ${this?.channel.guild.name}:${this?.channel.name}`
		);
		this.connection.disconnect();
		delete this.connection;
		delete this.dispatcher;

		this.status = PlayerStatus.Disconnected;
	}

	public destroy() {
		Logger.info(`Destroying player ${this?.channel.guild.name}`);
		this.disconnect();
		delete this.channel;

		this.status = PlayerStatus.Destroyed;
	}

	public play() {
		if (this.status !== PlayerStatus.Playing) {
			this.continue();
		}
	}
}
