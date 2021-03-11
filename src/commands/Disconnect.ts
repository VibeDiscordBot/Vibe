import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import { PlayerStatus, simplifyPlayerStatus } from '../classes/Player';
import { getNotification } from '../helpers/embed';

export default class extends Command {
	public name = 'disconnect';
	public alias = ['leave', 'l', 'd', 'fuckoff'];
	public permissions = [];

	public async exec(message: Message, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(message.guild);
		if (simplifyPlayerStatus(player.status) === PlayerStatus.Connected) {
			player.disconnect();
			message.channel.send(getNotification('Disconnected', message.author));
		} else {
			message.channel.send(
				getNotification("I'm not connected", message.author)
			);
		}
	}
}
