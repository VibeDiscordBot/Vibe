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

import { Document, Model } from 'mongoose';

type Collection = Model<Document<any, {}>, {}>;
type Doc<T> = T & Document;

export default class MongoDB {
	constructor(public _: typeof import('mongoose')) {}

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
		return this.getByData<T>(collection, {
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
		default_: any
	): Promise<Doc<T>> {
		return (
			(await this.getByData<T>(collection, data)) ||
			this.create<T>(collection, default_)
		);
	}

	public async getByIdOrDefault<T>(
		collection: Collection,
		id: any,
		default_: any
	): Promise<Doc<T>> {
		return (
			(await this.getById<T>(collection, id)) ||
			this.create<T>(collection, default_)
		);
	}
}
