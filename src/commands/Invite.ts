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
import { getBaseEmbed } from '../helpers/embed';
import generateInviteLink from '../helpers/generateInviteLink';
import { Option } from '../classes/Interactions';

export default class extends Command {
	public name = 'invite';
	public alias = ['add'];
	public permissions: PermissionType[] = [];
	public options: Option[] = [];

	private inviteLink = generateInviteLink();

	public async exec(context: CommandContext, args: string[], label: string) {
		context.send(
			getBaseEmbed(context.author)
				.setTitle('Add me to your server')
				.setDescription(
					`You can invite me using [this](${this.inviteLink}) link`
				)
		);
	}
}
