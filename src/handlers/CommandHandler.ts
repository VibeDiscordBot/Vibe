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
import Command, { CommandContext } from '../classes/Command';
import { CommandInteraction, PermissionString, TextChannel } from 'discord.js';
import Logger from '../classes/Logger';
import { DJPermission, requestPermission } from '../helpers/requestPermission';
import wait from '../helpers/wait';

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

	private async registerCommandAsSlashCommand(command: Command) {
		if (this.bot.cfg.fastStartup) {
			Logger.debug(
				`Skipped trying to register slash command ${command.name} because fastStartup is enabled`
			);
			return;
		}

		Logger.debug(`Trying to register slash command ${command.name}`);

		try {
			await this.bot.interactions.createCommand({
				name: command.name,
				description: command.name,
				options: command.options,
			});
		} catch (err) {
			const time = err.response.data['retry_after'] * 1000;
			Logger.debug(`Got error`);
			Logger.debug(err, false);
			Logger.debug(`Retrying after ${time}ms`);
			await wait(time);
			await this.registerCommandAsSlashCommand(command);
		}
	}

	public async init() {
		const commandsPath = this.bot.cfg.path.commands;
		const commands = fs.readdirSync(commandsPath, {
			withFileTypes: true,
		});

		for (let i = 0; i < commands.length; i++) {
			const command = commands[i];

			if (command.isFile() && command.name.endsWith('.ts')) {
				const p = path.join(commandsPath, command.name);
				const C = (await import(p)).default;
				const instance: Command = new C(this.bot);

				this.commands.push({
					cmd: instance,
					path: path.resolve(p),
				});

				await this.registerCommandAsSlashCommand(instance);
			}
		}
	}

	public async run(
		context: CommandContext,
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
					context.channel,
					context.member,
					costumPerms
				)
			).perm
		)
			return CommandResponse.UserInsufficientPermissions;

		cmd[0].cmd.exec(context, args, label);
		return CommandResponse.Success;
	}

	public async runInteraction(interaction: CommandInteraction) {
		const label = interaction.commandName;

		this.run(
			{
				author: interaction.member.user,
				member: interaction.member,
				channel: <TextChannel>interaction.channel,
				guild: interaction.guild,
			},
			interaction.options.map((o) => (o = <any>o.value.toString())),
			label
		);
	}
}
