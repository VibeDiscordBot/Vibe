import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import { getBaseEmbed, getNotification } from '../helpers/embed';
import { secondsToTimestamp } from '../helpers/timestamp';
import PermissionType from '../ts/PermissionType';

export default class extends Command {
	public name = 'queue';
	public alias = ['q'];
	public permissions: PermissionType[] = [];

	public async exec(message: Message, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(message.guild);
		const queue = player.queue.getQueue();

		if (!player.queue.current && queue.length < 1) {
			message.channel.send(
				getNotification('The queue is empty', message.author)
			);
		} else {
			const embed = getBaseEmbed(message.author).setTitle(
				`Queue for ${message.guild.name}`
			);

			let text = '';

			if (player.queue.current) {
				text += `[🎵] [${player.queue.current.info.title}](${
					player.queue.current.info.uri
				}) [${secondsToTimestamp(player.queue.current.info.length)}]`;
			}
			for (let i = 0; i < queue.length; i++) {
				const track = queue[i];
				text += `${text !== '' ? '\n' : ''}[${i + 1}] [${track.info.title}](${
					track.info.uri
				}) [${secondsToTimestamp(track.info.length)}]`;
			}

			embed.setDescription(text);

			message.channel.send(embed);
		}
	}
}
