import Command from '../classes/Command';
import { Message, MessageEmbed, PermissionString } from 'discord.js-light';
import { getNotification } from '../helpers/embed';

export default class Join extends Command {
	public name = 'join';
	public alias = ['j'];
	public permissions: PermissionString[] = ['CONNECT', 'SPEAK'];

	public async exec(message: Message, args: string[], label: string) {
		if (message.member.voice?.channel) {
			const player = await this.bot.guildManager.getPlayer(message.guild);

			await player.connect(message.member.voice.channel);
			message.channel.send(
				getNotification(`Joined ${player.channel.name}`, message.author)
			);
		} else {
			message.channel.send(
				getNotification(
					'You need to be in a voice channel to do that',
					message.author
				)
			);
		}
	}
}
