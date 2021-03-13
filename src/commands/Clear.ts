import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import { PlayerStatus, simplifyPlayerStatus } from '../classes/Player';
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
		if (simplifyPlayerStatus(player.status) === PlayerStatus.Connected) {
			message.channel.send(
				getNotification('Please disconnect me first', message.author)
			);
		} else {
			player.queue.clear();
			await player.sync();
			message.channel.send(
				getNotification('Cleared the queue', message.author)
			);
		}
	}
}
