import Event from '../classes/Event';
import * as djs from 'discord.js-light';
import { CommandResponse } from '../handlers/CommandHandler';

export default class extends Event {
	public name = 'Message (command)';
	public type = 'message';
	public once = false;

	public async run(message: djs.Message) {
		await this.bot.guildManager.register(message.guild);

		if (message.content.startsWith(this.bot.cfg.prefix)) {
			const content = message.content.slice(this.bot.cfg.prefix.length).trim();
			const args = content.split(' ');
			const label = args.shift();

			switch (await this.bot.commandHandler.run(message, args, label)) {
				case CommandResponse.Unknown:
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
