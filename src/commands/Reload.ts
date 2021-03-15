import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import PermissionType from '../ts/PermissionType';
import { getNotification } from '../helpers/embed';

export default class extends Command {
	public name = 'reload';
	public alias = [];
	public permissions: PermissionType[] = [];

	public async exec(message: Message, args: string[], label: string) {
		if (message.author.id === this.bot.cfg.ownerId) {
			await this.bot.reload();
			message.channel.send(
				getNotification('Reload successfull', message.author)
			);
		}
	}
}
