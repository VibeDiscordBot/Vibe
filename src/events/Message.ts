import Event from '../classes/Event';
import * as djs from 'discord.js-light';
import { CommandResponse } from '../handlers/CommandHandler';

export default class Message extends Event {
	public name = 'Message (command)';
	public type = 'message';
	public once = false;

	public async run(message: djs.Message) {
		if (message.content.startsWith(this.bot.cfg.prefix)) {
			const content = message.content.slice(this.bot.cfg.prefix.length).trim();
			const args = content.split(' ');
			const label = args.shift();

			switch(this.bot.commandHandler.run(message, args, label)) {
				case CommandResponse.Unknown:
					message.channel.send(`Unknown command "${label}"`);
					break
				case CommandResponse.InsufficientPermissions:
					message.channel.send('I have insufficient permissions')
					break
			}
		}
	}
}
