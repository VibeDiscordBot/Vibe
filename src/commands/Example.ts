import Command from '../classes/Command';
import { Message } from 'discord.js-light';

export default class Example extends Command {
	public name = 'example';
	public alias = [];
	public permissions = [];

	/* eslint-disable */
	public async exec(message: Message, args: string[], label: string) {}
}
