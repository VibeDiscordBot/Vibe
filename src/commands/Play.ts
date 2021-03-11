import Command from '../classes/Command';
import { Message, MessageEmbed } from 'discord.js-light';
import ytsr from 'ytsr';
import { PlayerStatus } from '../classes/Player';
import { getNotification } from '../helpers/embed';

export default class extends Command {
	public name = 'play';
	public alias = ['p'];
	public permissions = [];

	public async exec(message: Message, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(message.guild);

		if (
			player.status !== (PlayerStatus.Disconnected || PlayerStatus.Destroyed)
		) {
			const query = args.join(' ');
			const msg = await message.channel.send(
				getNotification(`Searching for ${query}`, message.author)
			);
			const song = <any>(
				(await ytsr(query)).items.find((r) => r.type === 'video')
			);

			if (!song)
				return message.channel.send(
					getNotification("Your query didn't return anything", message.author)
				);

			const queue = this.bot.guildManager.getQueue(message.guild);
			queue.add({
				author: song.author.name,
				duration: -1,
				name: song.title,
				url: song.url,
			});
			await this.bot.guildManager.sync(message.guild);

			msg.edit(
				getNotification(`Added ${song.title} to the queue`, message.author)
			);

			player.play();
		} else {
			message.channel.send(
				getNotification("I'm not connected to a voice channel", message.author)
			);
		}
	}
}
