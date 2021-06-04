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
import { Player, PlayerSchema } from '../schemas/player';
import PlayerClass from './Player';
import Queue from './Queue';
import MusicSearch from './MusicSearch';
import SpotifyWebApi from 'spotify-web-api-node';
import Interactions from './Interactions';
import generateInviteLink from '../helpers/generateInviteLink';

export default class Client extends djs.Client {
	public cfg: {
		path: {
			cwd: string;
			commands: string;
			events: string;
		};
		prefix: string;
		ownerId: string;
		unknowCommandMessages: boolean;
		fastStartup: boolean; // When enabled won't register any slash commands
	};

	public commandHandler: CommandHandler;
	public guildManager: GuildManager;
	public db: MongoDB;
	public shoukaku: ShoukakuManager;
	public musicSearch: MusicSearch;
	public spotifyApi: SpotifyWebApi;
	public interactions: Interactions;

	constructor() {
		super({
			intents: [
				'GUILD_MESSAGE_REACTIONS',
				'GUILD_VOICE_STATES',
				'GUILD_MESSAGES',
			],
		});

		this.cfg = {
			path: {
				cwd: process.cwd(),
				commands: path.join(__dirname, '..', 'commands'),
				events: path.join(__dirname, '..', 'events'),
			},
			prefix: process.env.BOT_PREFIX,
			ownerId: '464287642356285442',
			unknowCommandMessages: false,
			fastStartup: <boolean>(<any>process.env.FAST_STARTUP) || false,
		};
	}

	private async updateSpotify() {
		const token = await this.spotifyApi.clientCredentialsGrant();
		this.spotifyApi.setAccessToken(token.body.access_token);
		this.setTimeout(() => {
			this.updateSpotify();
		}, (token.body.expires_in - 10) * 1000);
	}

	public build(): Promise<void> {
		Logger.info(`Generated invite link ${generateInviteLink()}`);

		return new Promise(async (res) => {
			const eventHandler = new EventHandler(this);
			this.interactions = new Interactions(
				process.env.DISCORD_TOKEN,
				process.env.DISCORD_APPLICATION_ID
			);
			const commandHandler = new CommandHandler(this);

			await commandHandler.build();

			this.commandHandler = commandHandler;
			this.guildManager = new GuildManager(this);
			this.shoukaku = new ShoukakuManager(this);

			this.spotifyApi = new SpotifyWebApi({
				clientId: process.env.SPOTIFY_CLIENT_ID,
				clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
			});
			await this.updateSpotify();

			this.musicSearch = new MusicSearch(this.spotifyApi);

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

	public async reconnectAll() {
		const collection = this.db.getCollection('Player', PlayerSchema);
		const players = await this.db.getAll<Player>(collection);

		players
			.filter(
				(player) =>
					player.status === 'CONNECTED' || player.status === 'CONNECTING'
			)
			.forEach(async (player) => {
				const q = new Queue();
				const p = new PlayerClass(this, await this.guilds.forge(player._id), q);
				if (player.announceId)
					p.setAnnounce(await this.channels.forge(player.announceId, 'text'));
				q.setPlayer(p);

				for (let i = 0; i < player.queue.length; i++) {
					const track = player.queue[i];

					q.add(await q.findFromHash(track));
				}
				Logger.debug(
					`Restored ${player.queue.length} tracks from ${player._id}`
				);

				await p.connect(this.channels.forge(player.channelId, 'voice'));
				p.play();
				Logger.debug(`Restored ${player._id} and started playing`);
			});
	}
}
