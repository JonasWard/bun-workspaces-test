import { APP_SESSION_COLLECTION, APP_USER_COLLECTION } from '../appUser';
import { DatabaseType } from 'core';
import Elysia from 'elysia';
import { Db } from 'mongodb';
import { DataType, getBackendApiEndPoint, getDatabaseType } from 'orm';

const hasUserHandler = (user: any, set: any) => {
  if (process.env.WITH_AUTH && !user) {
    set.status = 401;
    return false;
  }
  return true;
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
    app.get(getBackendApiEndPoint(l, 'SingleOutput'), async ({ params: { id }, user, set }: any) => {
      console.log('SingleOutput - User context:', user);
      return hasUserHandler(user, set)
        ? await db.collection<DatabaseType[keyof DatabaseType][0]>(l).findOne({ _id: id })
        : authenticanRequired;
    });

    // GET all items - protected
    app.get(getBackendApiEndPoint(l, 'BulkOutput'), async ({ user, set }: any) => {
      console.log('BulkOutput - User context:', user);
      return hasUserHandler(user, set)
        ? db.collection<DatabaseType[keyof DatabaseType][0]>(l).find().toArray()
        : authenticanRequired;
    });

    // POST update single item - protected
    app.post(
      getBackendApiEndPoint(l, 'SingleUpdate'),
      async ({ params: { id }, body, user, set }: { params: { id: string }; body: any; user: any; set: any }) => {
        return hasUserHandler(user, set)
          ? await db.collection(l).updateOne({ _id: id } as any, { $set: body })
          : authenticanRequired;
      }
    );

    // POST bulk update - protected
    app.post(
      getBackendApiEndPoint(l, 'BulkUpdate'),
      async ({ body, user, set }: { body: { ids: string[]; dataToChange: any }; user: any; set: any }) => {
        return hasUserHandler(user, set)
          ? await db.collection(l).updateMany({}, { $set: body.dataToChange })
          : authenticanRequired;
      }
    );

    // DELETE single item - protected
    app.delete(
      getBackendApiEndPoint(l, 'SingleDelete'),
      async ({ params: { id }, user, set }: { params: { id: string }; user: any; set: any }) => {
        return hasUserHandler(user, set) ? await db.collection(l).deleteOne({ _id: id } as any) : authenticanRequired;
      }
    );

    // DELETE bulk items - protected
    app.delete(
      getBackendApiEndPoint(l, 'BulkDelete'),
      async ({ body, user, set }: { body: { ids: string[] }; user: any; set: any }) => {
        return hasUserHandler(user, set)
          ? await db.collection(l).deleteMany({ _id: { $in: body.ids } } as any)
          : authenticanRequired;
      }
    );
  });
};
