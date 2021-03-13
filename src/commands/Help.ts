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
			if (cmd.name === 'example') return;
			names.push(cmd.name);
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
