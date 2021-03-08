import * as djs from 'discord.js-light';
import * as path from 'path';
import CommandHandler from '../handlers/CommandHandler';
import EventHandler from '../handlers/EventHandler';

export default class Client extends djs.Client {
	public cfg: {
		path: {
			cwd: string;
			commands: string;
			events: string;
		};
		prefix: string;
	};

	public commandHandler: CommandHandler;

	constructor() {
		super();

		this.cfg = {
			path: {
				cwd: process.cwd(),
				commands: path.join(__dirname, '..', 'commands'),
				events: path.join(__dirname, '..', 'events'),
			},
			prefix: '!',
		};
	}

	public async build() {
		const eventHandler = new EventHandler(this);
		const commandHandler = new CommandHandler(this);

		await eventHandler.build();
		await commandHandler.build();

		this.commandHandler = commandHandler;
	}
}
