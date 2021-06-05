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

import {
	APIMessage,
	Guild,
	GuildMember,
	Message,
	MessageEmbed,
	TextChannel,
	User,
} from 'discord.js';
import PermissionType from '../ts/PermissionType';
import Client from './Client';
import { Option } from './Interactions';

export type MessageData = string | APIMessage | MessageEmbed;

export abstract class EditableMessage {
	abstract message?: Message;

	abstract edit(data: MessageData): Promise<EditableMessage>;
}

export type CommandContext = {
	author: User;
	member: GuildMember;
	guild: Guild;
	channel: TextChannel;
	send: (data: MessageData) => Promise<EditableMessage>;
};

export default abstract class Command {
	abstract name: string;
	abstract alias: string[] = [];
	abstract permissions: PermissionType[] = [];
	abstract options: Option[] = [];

	constructor(protected bot: Client) {}

	abstract exec(
		context: CommandContext,
		args: string[],
		label: string
	): Promise<any>;
}
