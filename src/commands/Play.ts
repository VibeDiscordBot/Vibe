import Command from '../classes/Command';
import { Message, MessageEmbed } from 'discord.js-light';
import ytsr from 'ytsr'
import { PlayerStatus } from '../classes/Player';

export default class Play extends Command {
	public name = 'play';
	public alias = ['p'];
	public permissions = [];

	public async exec(message: Message, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(message.guild);

		if(player.status !== (PlayerStatus.Disconnected || PlayerStatus.Destroyed)) {
			const query = args.join(' ')
			const msg = await message.channel.send(new MessageEmbed()
														.setTitle(`Searching for ${query}`))
			const song = <any>(await ytsr(query)).items.find(r => r.type === 'video')

			if(!song) return message.channel.send(new MessageEmbed()
													.setTitle('Your query didn\'t return anything'))

			const queue = this.bot.guildManager.getQueue(message.guild);
			queue.add({
				author: song.author.name,
				duration: -1,
				name: song.title,
				url: song.url,
			});
			await this.bot.guildManager.sync(message.guild);

			msg.edit(new MessageEmbed()
									.setTitle(`Added ${song.title} to the queue`))

			player.play()
		}else {
			message.channel.send(new MessageEmbed()
									.setTitle('I\'m not connected to a voice channel'))
		}
	}
}
