import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import { getNotification } from '../helpers/embed';
import PermissionType from '../ts/PermissionType';

export default class extends Command {
	public name = 'ping';
	public alias = ['pong'];
	public permissions: PermissionType[] = [];

	public async exec(message: Message, args: string[], label: string) {
		message.channel.send(getNotification('Pong', message.author));
	}
}
