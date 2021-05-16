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

import * as djs from 'discord.js-light';
import * as path from 'path';
import CommandHandler from '../handlers/CommandHandler';
import EventHandler from '../handlers/EventHandler';
import GuildManager from './managers/GuildManager';
import Logger from './Logger';
import ShoukakuManager from './managers/ShoukakuManager';
import MongoDB from './wrappers/MongoDB';

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
	public db: MongoDB;
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

			await commandHandler.build();

			this.commandHandler = commandHandler;
			this.guildManager = new GuildManager(this);
			this.shoukaku = new ShoukakuManager(this);

			const username =
				process.env.MONGODB_USERNAME && process.env.MONGODB_USERNAME !== ''
					? process.env.MONGODB_USERNAME
					: null;
			const password =
				process.env.MONGODB_PASSWORD && process.env.MONGODB_PASSWORD !== ''
					? process.env.MONGODB_PASSWORD
					: null;

			this.db = await MongoDB.create(
				process.env.MONGODB_HOST,
				process.env.MONGODB_DATABASE || 'vibe',
				username,
				password,
				process.env.MONGODB_AUTH_SOURCE
			);

			await eventHandler.build();

			res();
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

		await this.db._.connection.close();
		delete this.db;
	}

	public async reload() {
		await this.unload();
		await this.build();
	}
}
