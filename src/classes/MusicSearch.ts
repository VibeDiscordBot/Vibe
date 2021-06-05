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

import SpotifyWebApi from 'spotify-web-api-node';
import qs from 'querystring';
import Player from './Player';
import { ShoukakuTrack, ShoukakuTrackList } from 'shoukaku';

enum MusicSource {
	Spotify,
	YouTube,
}

enum MusicType {
	Playlist,
	Track,
}

type MusicUrl = {
	source: MusicSource;
	type: MusicType;
	id: string;
};

enum UrlScheme {
	HTTP,
	HTTPS,
}

type Url = {
	scheme: UrlScheme;
	host: string;
	path: string;
	queryString: string;
};

function parseUrl(input: string): Url {
	if (input.toLowerCase().startsWith('http://')) {
		const parts = input.slice('http://'.length).split('/');
		let host = parts.shift();
		if (host.startsWith('www.')) host = host.slice('www.'.length);

		return {
			scheme: UrlScheme.HTTP,
			host: host,
			path: parts.join('/'),
			queryString: parts.join('/').split('?')[1],
		};
	} else if (input.toLowerCase().startsWith('https://')) {
		const parts = input.slice('https://'.length).split('/');
		let host = parts.shift();
		if (host.startsWith('www.')) host = host.slice('www.'.length);

		return {
			scheme: UrlScheme.HTTPS,
			host: host,
			path: parts.join('/'),
			queryString: parts.join('/').split('?')[1],
		};
	} else return null;
}

export default class MusicSearch {
	constructor(private spotifyApi: SpotifyWebApi) {}

	public parseUrl(input: string): MusicUrl {
		const url = parseUrl(input);
		if (!url) return null;

		if (url.host.toLowerCase() === 'open.spotify.com') {
			if (url.path.startsWith('track')) {
				return {
					source: MusicSource.Spotify,
					type: MusicType.Track,
					id: url.path.slice('track/'.length).split('?')[0],
				};
			} else if (url.path.startsWith('playlist')) {
				return {
					source: MusicSource.Spotify,
					type: MusicType.Playlist,
					id: url.path.slice('playlist/'.length).split('?')[0],
				};
			} else return null;
		} else if (url.host.toLowerCase() === 'youtube.com') {
			if (url.path.startsWith('watch')) {
				return {
					source: MusicSource.YouTube,
					type: MusicType.Track,
					id: <string>qs.parse(url.queryString).v,
				};
			} else if (url.path.startsWith('playlist')) {
				return {
					source: MusicSource.YouTube,
					type: MusicType.Playlist,
					id: <string>qs.parse(url.queryString).list,
				};
			} else return null;
		} else if (url.host.toLowerCase() === 'youtu.be') {
			return {
				source: MusicSource.YouTube,
				type: MusicType.Track,
				id: url.path,
			};
		} else return null;
	}

	public async getTrack(
		player: Player,
		url: MusicUrl
	): Promise<ShoukakuTrack[]> {
		if (url.source === MusicSource.YouTube) {
			return (await player.node.rest.resolve(url.id)).tracks;
		} else if (url.source === MusicSource.Spotify) {
			if (url.type === MusicType.Track) {
				const track = await this.spotifyApi.getTrack(url.id);
				const query = `${track.body.name} by ${track.body.artists
					.map((a) => (a = <any>a.name))
					.join(' and ')}`;
				return [(await player.node.rest.resolve(query, 'youtube')).tracks[0]];
			} else if (url.type === MusicType.Playlist) {
				const playlist = await this.spotifyApi.getPlaylist(url.id);

				const promises: Promise<ShoukakuTrackList>[] = [];
				for (let i = 0; i < playlist.body.tracks.items.length; i++) {
					const track = playlist.body.tracks.items[i].track;

					const query = `${track.name} by ${track.artists
						.map((a) => (a = <any>a.name))
						.join(' and ')}`;

					promises.push(player.node.rest.resolve(query, 'youtube'));
				}

				const tracks = (await Promise.all(promises)).map(
					(tracks) => (tracks = <any>tracks.tracks[0])
				);
				return tracks;
			} else return [];
		} else return [];
	}

	public async findTrack(
		player: Player,
		query: string
	): Promise<ShoukakuTrack> {
		const track =
			(await this.spotifyApi.search(query, ['track'])).body.tracks.items[0] ||
			null;
		if (!track) return null;

		const youTubeQuery = `${track.name} by ${track.artists
			.map((a) => (a = <any>a.name))
			.join(' and ')}`;

		return (
			(await player.node.rest.resolve(youTubeQuery, 'youtube')).tracks[0] ||
			null
		);
	}
}
