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

import Command, { CommandContext, EditableMessage } from '../classes/Command';
import { getNotification } from '../helpers/embed';
import PermissionType from '../ts/PermissionType';
import { DJPermission } from '../helpers/requestPermission';
import PagedEmbed from '../classes/PagedEmbed';
import { Option, OptionType } from '../classes/Interactions';

export default class extends Command {
	public name = 'play';
	public alias = ['p'];
	public permissions: PermissionType[] = [DJPermission.any];
	public options: Option[] = [
		{
			name: 'source',
			description: 'The source/query of the song to play/add to queue',
			type: OptionType.String,
			required: true,
		},
	];
	public exclude = false;
	public description = 'Add a song/playlist to the queue';

	public async exec(context: CommandContext, args: string[], label: string) {
		if (!args[0])
			return context.send('Please specify a song url or search query');

		const player = await this.bot.guildManager.getPlayer(context.guild);

		if (player.connected) {
			const query = args.join(' ');
			const fromUrl = this.bot.musicSearch.parseUrl(query);
			let msg: EditableMessage = null;

			if (fromUrl) {
				msg = await context.send(
					getNotification(`Loading ${query}...`, context.author)
				);
			} else {
				msg = await context.send(
					getNotification(`Searching for ${query}...`, context.author)
				);
			}

			const songs = fromUrl
				? await this.bot.musicSearch.getTrack(player, fromUrl)
				: [await this.bot.musicSearch.findTrack(player, query)].filter(
						(s) => s !== null
				  );

			if (songs.length < 1)
				return msg.edit(
					getNotification("Your query didn't return anything", context.author)
				);

			player.queue.addTracks(songs);

			if (songs.length === 1) {
				msg.edit(
					getNotification(
						`Added [${songs[0].info.title}](${songs[0].info.uri}) to the queue`,
						context.author
					)
				);
			} else {
				const content = songs
					.map((s) => (s = <any>`\n- [${s.info.title}](${s.info.uri})`))
					.join('');
				const base = getNotification(
					'Added the following songs to the queue',
					context.author
				);

				if (msg.message) {
					PagedEmbed.createAsEditFromDescription(
						msg.message,
						context.author,
						true,
						content,
						base
					);
				} else {
					PagedEmbed.createFromDescription(
						context.channel,
						context.author,
						true,
						content,
						base
					);
				}
			}

			player.play();
		} else {
			context.send(
				getNotification("I'm not connected to a voice channel", context.author)
			);
		}
	}
}
