import { APP_SESSION_COLLECTION, APP_USER_COLLECTION } from '../appUser';
import { DatabaseType } from 'core';
import Elysia from 'elysia';
import { Db, ObjectId } from 'mongodb';
import { DataType, getBackendApiEndPoint, getDatabaseType } from 'orm';

const hasUserHandler = async (sessionId: string | undefined, set: any, db: Db): Promise<boolean> => {
  if (!process.env.WITH_AUTH) return true;
  if (sessionId) {
    const result = await db.collection(APP_SESSION_COLLECTION).findOne({ _id: new ObjectId(sessionId) });
    if (result) return true;
  }

  // if this doesn't work, kill the process
  set.status = 403;
  return false;
};

const authenticanRequired = { message: 'Authentication required' };

/**
 * Method that registers all the routes on the Elysia app with authentication
 * @param app - `Elysia` backend app
 * @param dataType - `DataType`, definition of the object model
 * @param db - `Db`, MongodDB Database instance
 * @return string json containing the defined routes
 */
export const registerRoutersOnAppForMongoDB = (app: Elysia, dataType: DataType, db: Db) => {
  getDatabaseType(dataType).fields.map(([l]) => {
    // GET single item - protected
    app.get(getBackendApiEndPoint(l, 'SingleOutput'), async ({ params: { id }, set, cookie: { sessionId } }: any) =>
      (await hasUserHandler(sessionId.value, set, db))
        ? await db.collection<DatabaseType[keyof DatabaseType][0]>(l).findOne({ _id: id })
        : authenticanRequired
    );

    // GET all items - protected
    app.get(getBackendApiEndPoint(l, 'BulkOutput'), async ({ set, cookie: { sessionId } }: any) =>
      (await hasUserHandler(sessionId.value, set, db))
        ? db.collection<DatabaseType[keyof DatabaseType][0]>(l).find().toArray()
        : authenticanRequired
    );

    // POST update single item - protected
    app.post(
      getBackendApiEndPoint(l, 'SingleUpdate'),
      async ({ params: { id }, body, cookie: { sessionId }, set }: any) => {
        return (await hasUserHandler(sessionId.value, set, db))
          ? await db.collection(l).updateOne({ _id: id } as any, { $set: body })
          : authenticanRequired;
      }
    );

    // POST bulk update - protected
    app.post(getBackendApiEndPoint(l, 'BulkUpdate'), async ({ body, cookie: { sessionId }, set }: any) => {
      return (await hasUserHandler(sessionId.value, set, db))
        ? await db.collection(l).updateMany({}, { $set: body.dataToChange })
        : authenticanRequired;
    });

    // DELETE single item - protected
    app.delete(
      getBackendApiEndPoint(l, 'SingleDelete'),
      async ({ params: { id }, cookie: { sessionId }, set }: any) => {
        return (await hasUserHandler(sessionId.value, set, db))
          ? await db.collection(l).deleteOne({ _id: id } as any)
          : authenticanRequired;
      }
    );

    // DELETE bulk items - protected
    app.delete(getBackendApiEndPoint(l, 'BulkDelete'), async ({ body, cookie: { sessionId }, set }: any) => {
      return (await hasUserHandler(sessionId.value, set, db))
        ? await db.collection(l).deleteMany({ _id: { $in: body.ids } } as any)
        : authenticanRequired;
    });
  });
};
