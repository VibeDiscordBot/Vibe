import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import PermissionType from '../ts/PermissionType';

export default class extends Command {
	public name = 'example';
	public alias = [];
	public permissions: PermissionType[] = [];

	/* eslint-disable */
	public async exec(message: Message, args: string[], label: string) {}
}
