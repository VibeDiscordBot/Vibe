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
import { Loop } from '../classes/Queue';
import { getNotification } from '../helpers/embed';
import { DJPermission } from '../helpers/requestPermission';

function toString(loop: Loop) {
	switch (loop) {
		case Loop.NoLoop:
			return 'not looping';
		case Loop.LoopQueue:
			return 'looping the whole queue';
		case Loop.LoopTrack:
			return 'looping current song';
	}
}

function parse(text: string): Loop | null {
	switch (text) {
		case 'off':
		case 'none':
		case 'false':
			return Loop.NoLoop;
		case 'queue':
		case 'all':
			return Loop.LoopQueue;
		case 'track':
		case 'song':
			return Loop.LoopTrack;
		default:
			return null;
	}
}

export default class extends Command {
	public name = 'loop';
	public alias = [];
	public permissions: PermissionType[] = [DJPermission.dj];

	public async exec(message: Message, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(message.guild);

		if (!args[0]) {
			message.channel.send(
				getNotification(
					`Currently ${toString(player.queue.getLoop())}`,
					message.author
				)
			);
		} else {
			const mode = parse(args[0]);
			if (mode !== null) {
				player.queue.setLoop(mode);
				message.channel.send(
					getNotification(`Now ${toString(mode)}`, message.author)
				);
			} else {
				message.channel.send(
					getNotification(
						`I couldn't parse "${args[0]}" as a loop mode`,
						message.author
					)
				);
			}
		}
	}
}
