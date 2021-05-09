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

import { MessageEmbed, User } from 'discord.js-light';
import { ShoukakuTrack } from 'shoukaku';
import { secondsToTimestamp } from './timestamp';

const embedColor = '#f29e02';

export function getBaseEmbed(author: User) {
	return new MessageEmbed()
		.setFooter(
			`Requested by ${author.username}`,
			`https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png?size=4096`
		)
		.setColor(embedColor);
}

export function getNotification(text: string, author: User) {
	return getBaseEmbed(author).setTitle(text);
}

export function getSongEmbed(track: ShoukakuTrack, user: User, title?: string) {
	const embed = getBaseEmbed(user);
	if (title) embed.setTitle(title);
	embed
		.addField('Title', track.info.title)
		.addField('Author', track.info.author)
		.addField('Duration', secondsToTimestamp(track.info.length))
		.addField('Url', track.info.uri);
	return embed;
}
