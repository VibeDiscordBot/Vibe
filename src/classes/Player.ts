import {
	Guild,
	StreamDispatcher,
	VoiceChannel,
	VoiceConnection,
} from 'discord.js-light';
import Client from './Client';
import Queue from './Queue';
import ytdl from 'ytdl-core-discord';
import Logger from './Logger';
import * as playerSchema from '../schemas/player';

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

	constructor(
		protected bot: Client,
		protected queue: Queue,
		public guild: Guild
	) {}

	public async connect(channel: VoiceChannel) {
		this.connection = await channel.join();
		this.channel = <VoiceChannel>await channel.fetch();

		this.status = PlayerStatus.Connected;

		this.sync();
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

					this.sync();
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

		this.sync();
	}

	public destroy() {
		Logger.info(`Destroying player ${this?.channel.guild.name}`);
		this.connection.disconnect();
		delete this.connection;
		delete this.dispatcher;
		delete this.channel;

		this.status = PlayerStatus.Destroyed;

		this.sync();
	}

	public play() {
		if (this.status !== PlayerStatus.Playing) {
			this.continue();
		}
	}

	public toObject(): Object {
		return {
			status: PlayerStatus[this.status.toString()].toLowerCase(),
			channel: this?.channel?.id || null,
			guild: this.guild.id,
			queue: this.queue.toObject(),
		};
	}

	public async sync() {
		const playerModel = this.bot.db.model('Player', playerSchema.default);

		let ref = await playerModel.findOne({
			guild: this.guild.id,
		});

		if (!ref) {
			let doc = this.toObject();
			ref = new playerModel(doc);
			await ref.save();
		} else {
			const obj = this.toObject();
			for (let key in obj) {
				ref[key] = obj[key];
			}
			await ref.save();
		}
	}
}
