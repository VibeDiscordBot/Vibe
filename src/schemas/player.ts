import { Schema } from 'mongoose';

const player = new Schema({
	status: {
		type: String,
		enum: ['playing', 'paused', 'connected', 'disconnected', 'destroyed'],
	},
	channel: String,
	guild: String,
	queue: [
		{
			name: String,
			author: String,
			duration: Number,
			url: String,
		},
	],
	loop: Number,
});

export default player;
