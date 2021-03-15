import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import PermissionType from '../ts/PermissionType';
import { getNotification, getSongEmbed } from '../helpers/embed';

export default class extends Command {
	public name = 'nowplaying';
	public alias = ['np'];
	public permissions: PermissionType[] = [];

	public async exec(message: Message, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(message.guild);
		if (player.current) {
			message.channel.send(
				getSongEmbed(player.current, message.author, 'Now playing')
			);
		} else {
			message.channel.send(
				getNotification('Not currently playing anything', message.author)
			);
		}
	}
}
