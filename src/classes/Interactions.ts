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

import axios from 'axios';

type SlashCommand = {
	name: string;
	description: string;
	options?: Option[];
};

export type Option = {
	name: string;
	description: string;
	type: OptionType;
	required: boolean;
	choices?: Choice[];
};

export enum OptionType {
	SubCommand = 1,
	SubCommandGroup = 2,
	String = 3,
	Integer = 4,
	Boolean = 5,
	User = 6,
	Channel = 7,
	Role = 8,
	Mentionable = 9,
}

export type Choice = {
	name: string;
	value: string;
};

type InteractionResponse = {
	id: string;
	token: string;
	type: InteractionResponseType;
	data?: InteractionResponseData;
};

export enum InteractionResponseType {
	AckPing = 1,
	Respond = 4,
	AckEditLaterLoading = 5,
	AckEditLaterNoLoading = 6,
	Edit = 7,
}

type InteractionResponseData = {
	tts?: boolean;
	content?: string;
	embeds?: any[];
	allowed_mentions?: any;
	flags?: InteractionResponseFlags;
};

export enum InteractionResponseFlags {
	Ephmeral = 64,
}

export default class Interactions {
	private commandsEndpoint: string;

	constructor(
		private token: string,
		applicationId: string,
		guildCommands = false,
		guildId?: string
	) {
		this.commandsEndpoint = `https://discord.com/api/v8/applications/${applicationId}`;
		if (guildCommands) this.commandsEndpoint += `/guilds/${guildId}`;
		this.commandsEndpoint += '/commands';
	}

	public async createCommand(command: SlashCommand): Promise<void> {
		await axios.post(this.commandsEndpoint, command, {
			headers: {
				Authorization: `Bot ${this.token}`,
			},
		});
	}

	public async sendResponse(response: InteractionResponse): Promise<void> {
		await axios.post(
			`https://discord.com/api/v8/interactions/${response.id}/${response.token}/callback`,
			{
				type: response.type,
				data: response.data,
			}
		);
	}
}
