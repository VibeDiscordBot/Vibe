import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import { getNotification } from '../helpers/embed';

export default class Ping extends Command {
	public name = 'ping';
	public alias = ['pong'];
	public permissions = [];

	public async exec(message: Message, args: string[], label: string) {
		message.channel.send(getNotification('Pong', message.author));
	}
}
