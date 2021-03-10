import Command from '../classes/Command';
import { Message } from 'discord.js-light';

export default class Example extends Command {
	public name = 'play';
	public alias = ['p'];
	public permissions = [];

	public async exec(message: Message, args: string[], label: string) {
		const url = args[0];

		const queue = this.bot.guildManager.getQueue(message.guild);
		queue.add({
			author: 'Unknown',
			duration: -1,
			name: 'Unknown',
			url: url,
		});
		await this.bot.guildManager.sync(message.guild);
	}
}
