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

import Command, { CommandContext } from '../classes/Command';
import { TextChannel, VoiceChannel } from 'discord.js-light';
import { getNotification } from '../helpers/embed';
import PermissionType from '../ts/PermissionType';
import { Option } from '../classes/Interactions';

export default class extends Command {
	public name = 'join';
	public alias = ['j'];
	public permissions: PermissionType[] = ['CONNECT', 'SPEAK'];
	public options: Option[] = [];

	public async exec(context: CommandContext, args: string[], label: string) {
		if (
			context.member.voice?.channel &&
			(context.member.voice.channel as VoiceChannel)
		) {
			const player = await this.bot.guildManager.getPlayer(context.guild);

			await player.connect(<VoiceChannel>context.member.voice.channel);
			player.setAnnounce(<TextChannel>context.channel);
			context.send(
				getNotification(
					`Joined ${
						(<VoiceChannel>(
							await this.bot.channels.fetch(context.member.voice.channel.id)
						)).name
					}`,
					context.author
				)
			);
		} else {
			context.send(
				getNotification(
					'You need to be in a voice channel to do that',
					context.author
				)
			);
		}
	}
}
