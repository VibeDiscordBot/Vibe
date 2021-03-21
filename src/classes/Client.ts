import * as djs from 'discord.js-light';
import * as path from 'path';
import CommandHandler from '../handlers/CommandHandler';
import EventHandler from '../handlers/EventHandler';
import GuildManager from './managers/GuildManager';
import mongoose from 'mongoose';
import Logger from './Logger';
import ShoukakuManager from './managers/ShoukakuManager';

export default class Client extends djs.Client {
	public cfg: {
		path: {
			cwd: string;
			commands: string;
			events: string;
		};
		prefix: string;
		ownerId: string;
	};

	public commandHandler: CommandHandler;
	public guildManager: GuildManager;
	public db: typeof mongoose;
	public shoukaku: ShoukakuManager;

	constructor() {
		super();

		this.cfg = {
			path: {
				cwd: process.cwd(),
				commands: path.join(__dirname, '..', 'commands'),
				events: path.join(__dirname, '..', 'events'),
			},
			prefix: process.env.BOT_PREFIX,
			ownerId: '464287642356285442',
		};
	}

	public build(): Promise<void> {
		return new Promise(async (res) => {
			const eventHandler = new EventHandler(this);
			const commandHandler = new CommandHandler(this);

			await eventHandler.build();
			await commandHandler.build();

			this.commandHandler = commandHandler;
			this.guildManager = new GuildManager(this);
			this.shoukaku = new ShoukakuManager(this);

			mongoose
				.connect(
					`mongodb://${process.env.MONGODB_HOST}/${
						process.env.MONGODB_DATABASE || 'vibe'
					}`,
					{
						useNewUrlParser: true,
						useUnifiedTopology: true,
					}
				)
				.then((db) => {
					this.db = db;
					res();
				});
		});
	}

	public async unload() {
		Logger.info('Unloading');

		this.removeAllListeners();

		this.commandHandler.commands.forEach((data) => {
			delete require.cache[require.resolve(data.path)];
		});
		delete this.commandHandler;

		delete this.guildManager;

		await this.db.connection.close();
		delete this.db;
	}

	public async reload() {
		await this.unload();
		await this.build();
	}
}
