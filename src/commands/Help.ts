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
import { getBaseEmbed } from '../helpers/embed';
import PermissionType from '../ts/PermissionType';

export default class extends Command {
	public name = 'help';
	public alias = ['?'];
	public permissions: PermissionType[] = [];

	public async exec(message: Message, args: string[], label: string) {
		const embed = getBaseEmbed(message.author).setTitle('Commands');

		const cmds = this.bot.commandHandler.commands;
		const names = [];
		cmds.forEach((cmd) => {
			if (cmd.cmd.name === 'example') return;
			names.push(cmd.cmd.name);
		});
		let text = '';
		let currentRow = 0;
		const perRow = 5;
		names.forEach((name) => {
			text += `\`${name}\` `;
			currentRow++;

			if (currentRow === perRow) {
				text += '\n';
				currentRow = 0;
			}
		});
		embed.setDescription(text);

		message.channel.send(embed);
	}
}
