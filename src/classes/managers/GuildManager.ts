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

import { Guild, Snowflake } from 'discord.js-light';
import Client from '../Client';
import Player from '../Player';
import Queue from '../Queue';

export default class GuildManager {
	private players: Map<Snowflake, Player> = new Map();

	constructor(protected bot: Client) {}

	public async register(guild: Guild) {
		if (!this.players.has(guild.id)) {
			const queue = new Queue();
			const player = new Player(this.bot, guild, queue);
			queue.setPlayer(player);
			this.players.set(guild.id, player);

			player.requestSync();
		}
	}

	public async getPlayer(guild: Guild) {
		return this.players.get(guild.id);
	}

	public removePlayer(guild: Guild) {
		this.players.delete(guild.id);
	}
}
