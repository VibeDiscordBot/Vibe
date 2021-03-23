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
		}
	}

	public async getPlayer(guild: Guild) {
		return this.players.get(guild.id);
	}

	public removePlayer(guild: Guild) {
		this.players.delete(guild.id);
	}
}
