import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import { getBaseEmbed, getNotification } from '../helpers/embed';

export default class extends Command {
	public name = 'queue';
	public alias = ['q'];
	public permissions = [];

	public async exec(message: Message, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(message.guild);
		const queue = player.queue.getQueue();

		if (!player.current && queue.length < 1) {
			message.channel.send(
				getNotification('The queue is empty', message.author)
			);
		} else {
			const embed = getBaseEmbed(message.author).setTitle(
				`Queue for ${message.guild.name}`
			);

			if (player.current) {
				embed.addField(`[🎵] ${player.current.name}`, '** **');
			}
			for (let i = 0; i < queue.length; i++) {
				const track = queue[i];
				embed.addField(`[${i + 1}] ${track.name}`, '** **');
			}

			message.channel.send(embed);
		}
	}
}
