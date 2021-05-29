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
import PermissionType from '../ts/PermissionType';
import { DJPermission } from '../helpers/requestPermission';
import { AudioEffect } from '../classes/Player';
import { getNotification } from '../helpers/embed';
import { Option, OptionType } from '../classes/Interactions';

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
	public options: Option[] = [
		{
			name: 'effect',
			description: 'The effect to change',
			required: true,
			type: OptionType.String,
			choices: [
				{
					name: 'Distortion',
					value: 'distortion',
				},
				{
					name: 'Volume',
					value: 'volume',
				},
				{
					name: 'Karaoke',
					value: 'karaoke',
				},
				{
					name: 'Rotation',
					value: 'rotation',
				},
				{
					name: 'Speed',
					value: 'timescale',
				},
				{
					name: 'Tremolo',
					value: 'tremolo',
				},
				{
					name: 'Vibrato',
					value: 'vibrato',
				},
				{
					name: 'Nightcore',
					value: 'nightcore',
				},
				{
					name: 'Bass',
					value: 'bass',
				},
			],
		},
		{
			name: 'value',
			description: 'The value for the effect, below 0 means off',
			type: OptionType.Integer,
			required: true,
		},
	];

	public async exec(context: CommandContext, args: string[], label: string) {
		const player = await this.bot.guildManager.getPlayer(context.guild);

		const effect = parseEffect(args[0] || '');
		if (!effect)
			return context.channel.send(
				getNotification('Please specify a valid audio effect', context.author)
			);

		const value = Number(args[1] || '!');
		if (isNaN(value))
			return context.channel.send(
				getNotification(
					'Please specify a value for the effect (number)',
					context.author
				)
			);

		if (await player.setEffect(effect, value)) {
			context.channel.send(
				getNotification(
					`Set ${AudioEffect[effect]} to ${value.toString()}`,
					context.author
				)
			);
		} else {
			context.channel.send(
				getNotification(
					'Something went wrong, nothing changed (audio effects are currently disabled)',
					context.author
				)
			);
		}
	}
}
