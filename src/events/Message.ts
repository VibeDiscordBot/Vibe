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

import Event from '../classes/Event';
import * as djs from 'discord.js-light';
import { CommandResponse } from '../handlers/CommandHandler';
import { TextChannel } from 'discord.js-light';

export default class extends Event {
	public name = 'Message (command)';
	public type = 'message';
	public once = false;

	public async run(message: djs.Message) {
		if (message.author.bot) return;

		await this.bot.guildManager.register(message.guild);

		if (message.content.startsWith(this.bot.cfg.prefix)) {
			const content = message.content.slice(this.bot.cfg.prefix.length).trim();
			const args = content.split(' ');
			const label = args.shift();

			switch (
				await this.bot.commandHandler.run(
					{
						author: message.author,
						channel: <TextChannel>message.channel,
						guild: message.guild,
						member: message.member,
					},
					args,
					label
				)
			) {
				case CommandResponse.Unknown:
					if (this.bot.cfg.unknowCommandMessages)
						message.channel.send(`Unknown command "${label}"`);
					break;
				case CommandResponse.InsufficientPermissions:
					message.channel.send('I have insufficient permissions');
					break;
				case CommandResponse.UserInsufficientPermissions:
					message.channel.send(
						'You have insufficient permissions (are you connected to a voice channel?)'
					);
					break;
			}
		}
	}
}
