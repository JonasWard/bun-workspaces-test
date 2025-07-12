import { DatabaseType } from 'core';
import Elysia from 'elysia';
import { Db } from 'mongodb';
import { DataType, getBackendApiEndPoint, getDatabaseType } from 'orm';

/**
 * Method that registers all the routes on the Elysia app
 * @param app - `Elysia` backend app
 * @param dataType - `DataType`, definition of the object model
 * @param db - `Db`, MongodDB Database instance
 * @return string json containing the defined routes
 */
export const registerRoutersOnAppForMongoDB = (app: Elysia, dataType: DataType, db: Db) => {
  getDatabaseType(dataType).fields.map(([l]) => {
    app.get(
      getBackendApiEndPoint(l, 'SingleOutput'),
      async ({ params: { id } }: { params: { id: string } }) =>
        await db.collection<DatabaseType[keyof DatabaseType][0]>(l).findOne({ _id: id })
    );
    app.get(getBackendApiEndPoint(l, 'BulkOutput'), () =>
      db.collection<DatabaseType[keyof DatabaseType][0]>(l).find().toArray()
    );
    app.post(
      getBackendApiEndPoint(l, 'SingleUpdate'),
      async ({ params: { id }, body }: { params: { id: string }; body: any }) =>
        await db.collection(l).updateOne({ _id: id } as any, { $set: body })
    );
    app.post(
      getBackendApiEndPoint(l, 'BulkUpdate'),
      async ({ body }: { body: { ids: string[]; dataToChange: any } }) =>
        await db.collection(l).updateMany({}, { $set: body.dataToChange })
    );
    app.delete(
      getBackendApiEndPoint(l, 'SingleDelete'),
      async ({ params: { id } }: { params: { id: string } }) => await db.collection(l).deleteOne({ _id: id } as any)
    );
    app.delete(
      getBackendApiEndPoint(l, 'BulkDelete'),
      async ({ body }: { body: { ids: string[] } }) =>
        await db.collection(l).deleteMany({ _id: { $in: body.ids } } as any)
    );
  });
};
