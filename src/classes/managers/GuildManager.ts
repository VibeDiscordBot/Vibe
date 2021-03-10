import { Guild, Snowflake } from 'discord.js-light';
import Client from '../Client';
import Player from '../Player';
import Queue from '../Queue';

export default class GuildManager {
	private queues: Map<Snowflake, Queue> = new Map();
	private players: Map<Snowflake, Player> = new Map();

	constructor(protected bot: Client) {}

	public async register(guild: Guild) {
		if (!this.queues.has(guild.id)) {
			const queue = new Queue(this.bot, guild);
			await queue.getFromDb();
			this.queues.set(guild.id, queue);
		}
	}

	public async getPlayer(guild: Guild) {
		if (this.players.has(guild.id)) return this.players.get(guild.id);
		const player = new Player(this.bot, this.queues.get(guild.id), guild);
		await player.sync();
		this.players.set(guild.id, player);
		return player;
	}

	public removePlayer(guild: Guild) {
		if (this.players.has(guild.id)) this.players.delete(guild.id);
	}

	public getQueue(guild: Guild) {
		return this.queues.get(guild.id);
	}

	public async sync(guild: Guild) {
		const player = await this.getPlayer(guild);
		await player.sync();
	}
}
