import bcrypt from 'bcryptjs';
import { Elysia, t } from 'elysia';
import { Db } from 'mongodb';
import { cookie } from '@elysiajs/cookie';

const APP_USER_COLLECTION = 'appUsers';

export type AppUser = {
  _id: string;
  username: string;
  email: string;
  hashedPassword: string;
};

export type AppSession = {
  _id: string;
  userID: string;
  createdAt: string;
  expiresAt: string;
};

export const registerAppUser = (app: Elysia, db: Db) =>
  app
    .use(cookie())

    .derive(({ request }) => {
      const cookieHeader = request.headers.get('cookie') ?? '';
      const cookies = Object.fromEntries(
        cookieHeader.split('; ').map((c) => {
          const [key, ...v] = c.split('=');
          return [key, v.join('=')];
        })
      );
      return { cookies };
    })
    // Auth middleware: find session in MongoDB
    .derive(async ({ cookies }) => {
      const sessionId = cookies['session_id'];
      if (!sessionId) return { user: null };

      const session = await db.collection(APP_USER_COLLECTION).findOne({ _id: sessionId } as any);
      if (session && new Date(session.expiresAt) >= new Date()) return { user: session.userId };
      return { user: null };
    })
    .group('/app-user', (app) =>
      app
        .use(cookie())
        .get('/get-all', async ({ set }) => {
          try {
            const users = db.collection(APP_USER_COLLECTION).find();
            set.status = 300;
            return users;
          } catch (e: unknown) {
            return {
              message: 'Unable to retrieve items from the database!',
              status: 500
            };
          }
        })
        .guard(
          {
            body: t.Object({
              username: t.String(),
              email: t.String(),
              password: t.String()
            })
          },
          (app) =>
            app.post('/create', async ({ body, set }) => {
              try {
                const newUser: Omit<AppUser, '_id'> = {
                  username: body.username,
                  email: body.email,
                  hashedPassword: await bcrypt.hash(body.password, 10)
                };

                const emailSearchResult = await db.collection(APP_USER_COLLECTION).findOne({ email: body.email });
                const usernameSearchResult = await db.collection(APP_USER_COLLECTION).findOne({ email: body.username });

                if (emailSearchResult || usernameSearchResult) {
                  set.status = 500;
                  return {
                    message: 'Unable to save entry to the database!',
                    status: 500
                  };
                }

                const newAppUser = (await db.collection(APP_USER_COLLECTION).insertOne(newUser)) as any as AppUser;

                set.status = 201;
                return newAppUser;
              } catch (e: any) {
                set.status = 500;
                return {
                  message: 'Unable to save entry to the database!',
                  status: 500
                };
              }
            })
        )
        .guard(
          {
            body: t.Object({
              username: t.String(),
              password: t.String()
            })
          },
          (app) =>
            app.post('/login', async ({ body, set, cookies }) => {
              try {
                const loginInformation = {
                  username: body.username,
                  password: body.password
                };

                const result = (await db
                  .collection(APP_USER_COLLECTION)
                  .findOne({ username: body.username })) as AppUser | null;

                if (!result || !(await bcrypt.compare(loginInformation.password, result.hashedPassword))) {
                  set.status = 500;
                  return {
                    message: 'Missing Data',
                    status: 500
                  };
                }

                const newSessionData: Omit<AppSession, '_id'> = {
                  userID: result._id,
                  createdAt: new Date().toString(),
                  expiresAt: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toString() // 100 days
                };

                const inserted = await db.collection(APP_USER_COLLECTION).insertOne(newSessionData);

                set.headers[
                  'Set-Cookie'
                ] = `session_id=${inserted.insertedId}; HttpOnly; Secure; Path=/; SameSite=Strict`;

                return { username: result.username, email: result.email };
              } catch (e: any) {
                set.status = 500;
                return {
                  message: 'Unable to save entry to the database!',
                  status: 500
                };
              }
            })
        )
        .post('/logout', async ({ cookies, set }) => {
          const sessionId = cookies['session_id'];
          try {
            await db.collection(APP_USER_COLLECTION).deleteOne({ _id: sessionId });

            set.headers['Set-Cookie'] = 'session_id=; Max-Age=0; Path=/; HttpOnly';

            return { success: true };
          } catch (e) {
            console.log(e);
          }
        })
        .put('/update', () => {})
    );
