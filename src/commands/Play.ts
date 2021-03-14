import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import ytsr, { Video } from 'ytsr';
import { PlayerStatus, simplifyPlayerStatus } from '../classes/Player';
import { getNotification } from '../helpers/embed';
import { timestampToSeconds } from '../helpers/timestamp';
import PermissionType from '../ts/PermissionType';
import { DJPermission } from '../helpers/requestPermission';

export default class extends Command {
	public name = 'play';
	public alias = ['p'];
	public permissions: PermissionType[] = [DJPermission.any];

	public async exec(message: Message, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(message.guild);

		if (simplifyPlayerStatus(player.status) !== PlayerStatus.Disconnected) {
			const query = args.join(' ');
			const msg = await message.channel.send(
				getNotification(`Searching for ${query}`, message.author)
			);
			const song = <Video>(
				(await ytsr(query)).items.find((r) => r.type === 'video')
			);

			if (!song)
				return message.channel.send(
					getNotification("Your query didn't return anything", message.author)
				);

			const duration = timestampToSeconds(song.duration);
			if (duration > 10 * 60) {
				return message.channel.send(
					getNotification('That song is longer than 10 minutes', message.author)
				);
			}

			const queue = this.bot.guildManager.getQueue(message.guild);
			queue.add({
				author: song.author.name,
				duration: duration,
				name: song.title,
				url: song.url,
			});
			await this.bot.guildManager.sync(message.guild);

			msg.edit(
				getNotification(`Added ${song.title} to the queue`, message.author)
			);

			player.play();
		} else {
			message.channel.send(
				getNotification("I'm not connected to a voice channel", message.author)
			);
		}
	}
}
