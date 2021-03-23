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
