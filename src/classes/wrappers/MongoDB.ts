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

import mongoose, { Document, Model, ConnectOptions } from 'mongoose';
import updateProperties from '../../helpers/updateProperties';

type Collection = Model<Document<any, {}>, {}>;
type Doc<T> = T & Document;
type Partial<T> = {
	[P in keyof T]?: T[P];
};
export type DocDefault<T> = Partial<T> & {
	_id?: any;
};

export default class MongoDB {
	private constructor(public _: typeof import('mongoose')) {}

	public static async create(
		host: string,
		database: string,
		username: string = null,
		password: string = null,
		authSource = 'admin',
		mongooseOpts: ConnectOptions = {}
	): Promise<MongoDB> {
		const opts: ConnectOptions = updateProperties(mongooseOpts, <
			ConnectOptions
		>{
			useUnifiedTopology: true,
			useNewUrlParser: true,

			user: username,
			pass: password,
			authSource: authSource,
		});

		const db = await mongoose.connect(`mongodb://${host}/${database}`, opts);
		return new MongoDB(db);
	}

	public getCollection(name: string, schema: any): Collection {
		return this._.model(name, schema);
	}

	public async getByData<T>(
		collection: Collection,
		data: any
	): Promise<Doc<T>> {
		return <any>await collection.findOne(data);
	}

	public async getById<T>(collection: Collection, id: any): Promise<Doc<T>> {
		return await this.getByData<T>(collection, {
			_id: id,
		});
	}

	public async create<T>(collection: Collection, data: any): Promise<Doc<T>> {
		const doc = new collection(data);
		await doc.save();
		return <any>doc;
	}

	public async getByDataOrDefault<T>(
		collection: Collection,
		data: any,
		default_: DocDefault<T>
	): Promise<Doc<T>> {
		return (
			(await this.getByData<T>(collection, data)) ||
			this.create<T>(collection, default_)
		);
	}

	public async getByIdOrDefault<T>(
		collection: Collection,
		id: any,
		default_: DocDefault<T>
	): Promise<Doc<T>> {
		return (
			(await this.getById<T>(collection, id)) ||
			this.create<T>(collection, default_)
		);
	}

	public async setByData<T>(
		collection: Collection,
		data: any,
		value: DocDefault<T>
	): Promise<Doc<T>> {
		let doc = await this.getByDataOrDefault<T>(collection, data, value);
		doc = updateProperties(value, doc);
		await doc.save();

		return doc;
	}

	public async setById<T>(
		collection: Collection,
		id: any,
		value: DocDefault<T>
	): Promise<Doc<T>> {
		return await this.setByData(
			collection,
			{
				_id: id,
			},
			value
		);
	}
}
