/*
    Copyright (C) 2021 Tijn Hoftijzer

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import { getNotification } from '../helpers/embed';
import PermissionType from '../ts/PermissionType';
import { DJPermission } from '../helpers/requestPermission';
import PagedEmbed from '../classes/PagedEmbed';

export default class extends Command {
	public name = 'play';
	public alias = ['p'];
	public permissions: PermissionType[] = [DJPermission.any];

	public async exec(message: Message, args: string[], label: string) {
		if (!args[0])
			return message.channel.send('Please specify a song url or search query');

		const player = await this.bot.guildManager.getPlayer(message.guild);

		if (player.connected) {
			const query = args.join(' ');
			const fromUrl = this.bot.musicSearch.parseUrl(query);
			let msg: Message = null;

			if (fromUrl) {
				msg = await message.channel.send(
					getNotification(`Loading ${query}...`, message.author)
				);
			} else {
				msg = await message.channel.send(
					getNotification(`Searching for ${query}...`, message.author)
				);
			}

			const songs = fromUrl
				? await this.bot.musicSearch.getTrack(player, fromUrl)
				: [
						(await this.bot.musicSearch.findTracks(player, query)[0]) || null,
				  ].filter((s) => s !== null);

			if (songs.length < 1)
				return msg.edit(
					getNotification("Your query didn't return anything", message.author)
				);

			player.queue.addTracks(songs);

			if (songs.length === 1) {
				msg.edit(
					getNotification(
						`Added [${songs[0].info.title}](${songs[0].info.uri}) to the queue`,
						message.author
					)
				);
			} else {
				PagedEmbed.createAsEditFromDescription(
					msg,
					message.author,
					true,
					songs
						.map((s) => (s = <any>`\n- [${s.info.title}](${s.info.uri})`))
						.join(''),
					getNotification(
						'Added the following songs to the queue',
						message.author
					)
				);
			}

			player.play();
		} else {
			message.channel.send(
				getNotification("I'm not connected to a voice channel", message.author)
			);
		}
	}
}
