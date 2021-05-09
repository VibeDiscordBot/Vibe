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

import { VoiceState } from 'discord.js-light';
import Event from '../classes/Event';

export default class extends Event {
	public name = 'VoiceStateUpdate (Player channel)';
	public type = 'voiceStateUpdate';
	public once = false;

	public async run(oldState: VoiceState, newState: VoiceState) {
		if (newState) return; // Someone connected or updated (not disconnected)
		if (oldState.member.id === this.bot.user.id) return; // Ignore events originated from the bot
		const player = await this.bot.guildManager.getPlayer(oldState.guild);
		if (player.channel.id === oldState.channel.id) {
			player.update();
		}
	}
}
