import Command from '../classes/Command';
import { Message, TextChannel } from 'discord.js-light';
import { getNotification } from '../helpers/embed';
import PermissionType from '../ts/PermissionType';

export default class extends Command {
	public name = 'join';
	public alias = ['j'];
	public permissions: PermissionType[] = ['CONNECT', 'SPEAK'];

	public async exec(message: Message, args: string[], label: string) {
		if (message.member.voice?.channel) {
			const player = await this.bot.guildManager.getPlayer(message.guild);

			await player.connect(message.member.voice.channel);
			player.setAnnounce(<TextChannel>message.channel);
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
