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

export function timestampToSeconds(timestamp: string): number {
	const parts = timestamp.split(':');

	let time = 0;

	switch (parts.length) {
		case 1:
			time += Number(parts[0]);
			break;
		case 2:
			time += Number(parts[1]);
			time += Number(parts[0]) * 60;
			break;
		case 3:
			time += Number(parts[2]);
			time += Number(parts[1]) * 60;
			time += Number(parts[0]) * 60 * 60;
			break;
		case 4:
			time += Number(parts[3]);
			time += Number(parts[2]) * 60;
			time += Number(parts[1]) * 60 * 60;
			time += Number(parts[0]) * 60 * 60 * 24;
			break;
	}

	return time;
}

export function secondsToTimestamp(seconds: number): string {
	let rest = seconds;

	const days = Math.floor(rest / 60 / 60 / 24);
	rest -= days * 60 * 60 * 24;

	const hours = Math.floor(rest / 60 / 60);
	rest -= hours * 60 * 60;

	const minutes = Math.floor(rest / 60);
	rest -= minutes * 60;

	let timestamp = '';
	if (days > 0) timestamp += `${days.toString().padStart(2, '0')}:`;
	if (hours > 0 || days > 0)
		timestamp += `${hours.toString().padStart(2, '0')}:`;
	if (minutes > 0 || days > 0 || hours > 0)
		timestamp += `${minutes.toString().padStart(2, '0')}:`;
	timestamp += rest.toString().padStart(2, '0');

	return timestamp;
}
