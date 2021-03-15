import { MessageEmbed, User } from 'discord.js-light';
import { Track } from '../classes/Queue';
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

export function getSongEmbed(track: Track, user: User, title?: string) {
	const embed = getBaseEmbed(user);
	if (title) embed.setTitle(title);
	embed
		.addField('Title', track.name)
		.addField('Author', track.author)
		.addField('Duration', secondsToTimestamp(track.duration))
		.addField('Url', track.url);
	return embed;
}
