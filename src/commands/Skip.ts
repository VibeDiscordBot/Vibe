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
import PermissionType from '../ts/PermissionType';
import { DJPermission } from '../helpers/requestPermission';
import { getNotification } from '../helpers/embed';

export default class extends Command {
	public name = 'skip';
	public alias = ['s'];
	public permissions: PermissionType[] = [
		DJPermission.alone,
		DJPermission.dj,
		DJPermission.vote,
	];

	public async exec(message: Message, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(message.guild);
		const amount = Number(args[0]);
		if (!isNaN(amount)) {
			player.skip(amount);
			message.channel.send(
				getNotification(`Skipped ${amount} songs`, message.author)
			);
		} else {
			player.skip(1);
			message.channel.send(getNotification('Skipped 1 song', message.author));
		}
	}
}
