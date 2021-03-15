import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import PermissionType from '../ts/PermissionType';
import { getNotification, getSongEmbed } from '../helpers/embed';

export default class extends Command {
	public name = 'inspect';
	public alias = ['i'];
	public permissions: PermissionType[] = [];

	public async exec(message: Message, args: string[], label: string) {
		const index = args[0] ? Number(args[0]) - 1 : NaN;
		if (isNaN(index)) {
			return message.channel.send(
				getNotification('Please specify the song index', message.author)
			);
		}

		const player = await this.bot.guildManager.getPlayer(message.guild);
		if (player.queue.getQueue()[index]) {
			message.channel.send(
				getSongEmbed(player.queue.getQueue()[index], message.author)
			);
		} else {
			message.channel.send(
				getNotification("There's no song at that index", message.author)
			);
		}
	}
}
