import Command from '../classes/Command';
import { Message } from 'discord.js-light';
import PermissionType from '../ts/PermissionType';
import { DJPermission } from '../helpers/requestPermission';
import { AudioEffect } from '../classes/Player';
import { getNotification } from '../helpers/embed';

function parseEffect(text: string): AudioEffect | null {
	switch (text.toString()) {
		case 'distortion':
		case 'distort':
			return AudioEffect.Distortion;
		case 'volume':
		case 'vol':
		case 'v':
			return AudioEffect.Volume;
		case 'karaoke':
			return AudioEffect.Karaoke;
		case 'rotation':
			return AudioEffect.Rotation;
		case 'timescale':
		case 'speed':
			return AudioEffect.Timescale;
		case 'tremolo':
			return AudioEffect.Tremolo;
		case 'vibrato':
			return AudioEffect.Vibrato;

		case 'nightcore':
		case 'nc':
			return AudioEffect.Nightcore;

		case 'bass':
			return AudioEffect.Bass;

		default:
			return null;
	}
}

export default class extends Command {
	public name = 'effect';
	public alias = ['ef'];
	public permissions: PermissionType[] = [DJPermission.dj];

	public async exec(message: Message, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(message.guild);

		const effect = parseEffect(args[0] || '');
		if (!effect)
			return message.channel.send(
				getNotification('Please specify a valid audio effect', message.author)
			);

		const value = Number(args[1] || '!');
		if (isNaN(value))
			return message.channel.send(
				getNotification(
					'Please specify a value for the effect (number)',
					message.author
				)
			);

		await player.setEffect(effect, value);
		message.channel.send(
			getNotification(
				`Set ${AudioEffect[effect]} to ${value.toString()}`,
				message.author
			)
		);
	}
}
