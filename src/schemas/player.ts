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

import { Schema } from 'mongoose';
import { ShoukakuStatus } from 'shoukaku';
import { Loop } from '../classes/Queue';

export interface Player {
	status: ShoukakuStatus | 'NULL';
	channelId: string;
	queue: string[];
	loop: Loop;
	announceId: string;
}

export const PlayerSchema = new Schema({
	status: {
		type: String,
		enum: ['CONNECTED', 'CONNECTING', 'DISCONNECTED', 'DISCONNECTING', 'NULL'], // ShoukakuStatus
	},
	channelId: String,
	queue: [String],
	loop: Number,
	_id: String,
	announceId: String,
});
