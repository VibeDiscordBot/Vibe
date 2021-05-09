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

import 'colors';

export default class Logger {
	private static log(key: string, text: string) {
		console.log('['.bold + key + ']'.bold + ' ' + text);
	}

	public static info(text: string) {
		this.log('Info'.blue, text);
	}

	public static error(text: string) {
		this.log('Error'.red, text);
	}
}
