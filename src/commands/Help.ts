import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import { getBaseEmbed } from '../helpers/embed';

export default class extends Command {
	public name = 'help';
	public alias = ['?'];
	public permissions = [];

	public async exec(message: Message, args: string[], label: string) {
		const embed = getBaseEmbed(message.author).setTitle('Commands');

		const cmds = this.bot.commandHandler.commands;
		const perLine = 5;
		let newLineIn = perLine;
		let text = '';
		for (let i = 0; i < cmds.length; i++) {
			const cmd = cmds[i];

			if (cmd.name === 'example') continue;

			text += `\`${cmd.name}\` `;

			if (newLineIn === 1) {
				newLineIn = perLine;
				embed.addField(text.trim(), '** **');
				text = '';
			} else newLineIn--;
		}

		message.channel.send(embed);
	}
}
