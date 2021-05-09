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

import Handler from '../classes/Handler';
import * as path from 'path';
import * as fs from 'fs';
import Command from '../classes/Command';
import { Message, PermissionString, TextChannel } from 'discord.js';
import Logger from '../classes/Logger';
import { DJPermission, requestPermission } from '../helpers/requestPermission';

export enum CommandResponse {
	Unknown,
	InsufficientPermissions,
	Error,
	Success,
	UserInsufficientPermissions,
}

export default class CommandHandler extends Handler {
	public name = 'Commandhandler';

	public commands: {
		cmd: Command;
		path: string;
	}[] = [];

	public async init() {
		const commandsPath = this.bot.cfg.path.commands;

		fs.readdirSync(commandsPath, {
			withFileTypes: true,
		}).forEach(async (command) => {
			if (command.isFile() && command.name.endsWith('.ts')) {
				const p = path.join(commandsPath, command.name);
				const C = (await import(p)).default;
				const instance: Command = new C(this.bot);

				this.commands.push({
					cmd: instance,
					path: path.resolve(p),
				});
			}
		});
	}

	public async run(
		message: Message,
		args: string[],
		label: string
	): Promise<CommandResponse> {
		const cmd = this.commands.filter(
			(cmd) => cmd.cmd.name === label || cmd.cmd.alias.includes(label)
		);

		if (cmd.length < 1) return CommandResponse.Unknown;
		if (cmd.length > 1) {
			Logger.error(`More than 1 command eligable for label ${label}`);
			return CommandResponse.Unknown;
		}

		//if (!message.guild.me.hasPermission(cmd[0].permissions)) return CommandResponse.InsufficientPermissions;
		const discordPerms: PermissionString[] = [];
		const costumPerms: DJPermission[] = [];
		cmd[0].cmd.permissions.forEach((perm) => {
			if (typeof perm === 'number') {
				costumPerms.push(perm);
			} else discordPerms.push(perm);
		});

		if (
			!(
				await requestPermission(
					this.bot,
					<TextChannel>message.channel,
					message.member,
					costumPerms
				)
			).perm
		)
			return CommandResponse.UserInsufficientPermissions;

		cmd[0].cmd.exec(message, args, label);
		return CommandResponse.Success;
	}
}
