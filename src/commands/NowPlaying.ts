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
import { Option } from '../classes/Interactions';

export default class extends Command {
	public name = 'nowplaying';
	public alias = ['np'];
	public permissions: PermissionType[] = [];
	public options: Option[] = [];
	public exclude = false;
	public description = 'View the currently playing song';

	public async exec(context: CommandContext, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(context.guild);
		if (player.queue.current) {
			context.send(
				getSongEmbed(player.queue.current, context.author, 'Now playing')
			);
		} else {
			context.send(
				getNotification('Not currently playing anything', context.author)
			);
		}
	}
}
