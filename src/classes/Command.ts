import { Message } from 'discord.js';
import PermissionType from '../ts/PermissionType';
import Client from './Client';

export default abstract class Command {
	abstract name: string;
	abstract alias: string[] = [];
	abstract permissions: PermissionType[] = [];

	constructor(protected bot: Client) {}

	abstract exec(message: Message, args: string[], label: string): Promise<any>;
}
