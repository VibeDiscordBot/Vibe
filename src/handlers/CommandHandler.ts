import Handler from '../classes/Handler';
import * as path from 'path';
import * as fs from 'fs';
import Command from '../classes/Command';
import { Message } from 'discord.js';
import Logger from '../classes/Logger';

export enum CommandResponse {
	Unknown,
	InsufficientPermissions,
	Error,
	Success,
}

export default class CommandHandler extends Handler {
	public name: string = 'Commandhandler';

	private commands: Command[] = [];

	public async init() {
		const commandsPath = this.bot.cfg.path.commands;

		fs.readdirSync(commandsPath, {
			withFileTypes: true,
		}).forEach(async (command) => {
			if (command.isFile() && command.name.endsWith('.ts')) {
				const C = (await import(path.join(commandsPath, command.name))).default;
				const instance: Command = new C(this.bot);

				this.commands.push(instance);
			}
		});
	}

	public run(message: Message, args: string[], label: string): CommandResponse {
		const cmd = this.commands.filter(
			(cmd) => cmd.name === label || cmd.alias.includes(label)
		);

		if (cmd.length < 1) return CommandResponse.Unknown;
		if (cmd.length > 1) {
			Logger.error(`More than 1 command eligable for label ${label}`);
			return CommandResponse.Unknown;
		}

		for (let i = 0; i < cmd[0].permissions.length; i++) {
			const perm = cmd[0].permissions[i];

			if (!message.guild.me.hasPermission(perm)) {
				return CommandResponse.InsufficientPermissions;
			}
		}

		cmd[0].exec(message, args, label);
		return CommandResponse.Success;
	}
}
