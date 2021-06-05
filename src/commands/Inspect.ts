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

import Command, { CommandContext } from '../classes/Command';
import PermissionType from '../ts/PermissionType';
import { getNotification, getSongEmbed } from '../helpers/embed';
import { Option, OptionType } from '../classes/Interactions';

export default class extends Command {
	public name = 'inspect';
	public alias = ['i'];
	public permissions: PermissionType[] = [];
	public options: Option[] = [
		{
			name: 'position',
			description: 'The position in queue of the song to inspect',
			type: OptionType.Integer,
			required: true,
		},
	];
	public exclude = false;
	public description = 'View more details of a song in the queue';

	public async exec(context: CommandContext, args: string[], label: string) {
		const index = args[0] ? Number(args[0]) - 1 : NaN;
		if (isNaN(index)) {
			return context.send(
				getNotification('Please specify the song index', context.author)
			);
		}

		const player = await this.bot.guildManager.getPlayer(context.guild);
		if (player.queue.getQueue()[index]) {
			context.send(
				getSongEmbed(player.queue.getQueue()[index], context.author)
			);
		} else {
			context.send(
				getNotification("There's no song at that index", context.author)
			);
		}
	}
}
