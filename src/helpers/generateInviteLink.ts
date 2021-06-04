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

import { PermissionResolvable, Permissions } from 'discord.js';

export default function generateInviteLink() {
	const clientId = '766144268044992512';
	const permissions: PermissionResolvable[] = [
		'VIEW_CHANNEL',
		'SEND_MESSAGES',
		'EMBED_LINKS',
		'USE_EXTERNAL_EMOJIS',
		'ADD_REACTIONS',
		'CONNECT',
		'SPEAK',
	];

	return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${
		new Permissions(permissions).bitfield
	}&scope=${encodeURIComponent(['bot', 'applications.commands'].join(' '))}`;
}
