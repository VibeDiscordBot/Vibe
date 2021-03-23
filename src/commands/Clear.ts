import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import { getNotification } from '../helpers/embed';
import PermissionType from '../ts/PermissionType';
import { DJPermission } from '../helpers/requestPermission';

export default class extends Command {
	public name = 'clear';
	public alias = ['c'];
	public permissions: PermissionType[] = [
		DJPermission.dj,
		DJPermission.alone,
		DJPermission.vote,
	];

	public async exec(message: Message, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(message.guild);
		if (player.player) {
			message.channel.send(
				getNotification('Please disconnect me first', message.author)
			);
		} else {
			player.queue.clear();
			message.channel.send(
				getNotification('Cleared the queue', message.author)
			);
		}
	}
}
