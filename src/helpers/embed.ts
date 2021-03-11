import { MessageEmbed, User } from 'discord.js-light';

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
