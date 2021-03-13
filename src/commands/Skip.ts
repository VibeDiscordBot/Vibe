import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import PermissionType from '../ts/PermissionType';
import { DJPermission } from '../helpers/requestPermission';
import { getNotification } from '../helpers/embed';

export default class extends Command {
	public name = 'skip';
	public alias = ['s'];
	public permissions: PermissionType[] = [
		DJPermission.alone,
		DJPermission.dj,
		DJPermission.vote,
	];

	public async exec(message: Message, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(message.guild);
		const amount = Number(args[0]);
		if (!isNaN(amount)) {
			player.skip(amount);
			message.channel.send(
				getNotification(`Skipped ${amount} songs`, message.author)
			);
		} else {
			player.skip(1);
			message.channel.send(getNotification('Skipped 1 song', message.author));
		}
	}
}
