import bcrypt from 'bcryptjs';
import { Elysia, t } from 'elysia';
import { Db, ObjectId } from 'mongodb';
import { cookie } from '@elysiajs/cookie';

export const APP_USER_COLLECTION = 'appUsers';
export const APP_SESSION_COLLECTION = 'appSessions';

export type AppUser = {
  _id: string;
  username: string;
  email: string;
  hashedPassword: string;
};

export type AppSession = {
  _id: string;
  userID: string;
  createdAt: Date;
  expiresAt: Date;
};

export const registerAppUser = (app: Elysia, db: Db) => {
  // Apply authentication middleware to the entire app
  app
    .use(cookie())
    .derive(({ request }) => {
      const cookieHeader = request.headers.get('cookie') ?? '';
      console.log('=== COOKIE DEBUG ===');
      console.log('Request URL:', request.url);
      console.log('Request Origin:', request.headers.get('origin'));
      console.log('Raw cookie header:', cookieHeader);
      console.log('All headers:', Object.fromEntries(request.headers.entries()));

      if (!cookieHeader) {
        console.log('No cookies found in request');
        return { cookies: {} };
      }

      const cookies = Object.fromEntries(
        cookieHeader.split('; ').map((c) => {
          const [key, ...v] = c.split('=');
          return [key, v.join('=')];
        })
      );
      console.log('Parsed cookies:', cookies);
      console.log('=== END COOKIE DEBUG ===');
      return { cookies };
    })
    // Auth middleware: find session in MongoDB (check both cookies and headers)
    .derive(async ({ cookies, request }) => {
      // Try to get session ID from cookie first
      let sessionId = cookies['session_id'];
      console.log('sessionId from cookie:' + sessionId);

      // If no cookie, try Authorization header as fallback
      if (!sessionId) {
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          sessionId = authHeader.substring(7);
          console.log('sessionId from header:' + sessionId);
        }
      }

      if (!sessionId) {
        console.log('No session ID found in cookies or headers');
        return { user: null };
      }

      const session = await db.collection(APP_SESSION_COLLECTION).findOne({ _id: new ObjectId(sessionId) } as any);
      console.log('session found:' + JSON.stringify(session, null, 2));
      if (session && new Date(session.expiresAt) >= new Date()) {
        const user = await db.collection(APP_USER_COLLECTION).findOne({ _id: session.userID } as any);
        console.log('user found:' + JSON.stringify(user, null, 2));
        return { user: user ? { id: user._id, username: user.username, email: user.email } : null };
      }
      return { user: null };
    })
    .group(
      '/app-user',
      (
        app // Register auth routes in a group
      ) =>
        app
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
                  const usernameSearchResult = await db
                    .collection(APP_USER_COLLECTION)
                    .findOne({ username: body.username });

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
              app.post('/login', async ({ body, set, request }) => {
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
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000) // 100 days
                  };

                  const inserted = await db.collection(APP_SESSION_COLLECTION).insertOne(newSessionData);

                  const isProduction = process.env.NODE_ENV === 'production';

                  // Configure cookies for cross-origin deployment
                  let cookieValue = `session_id=${inserted.insertedId}; HttpOnly; Path=/`;

                  if (isProduction) {
                    // For cross-origin requests, we need SameSite=None and Secure
                    // But only if we're on HTTPS
                    const isHttps =
                      request.headers.get('x-forwarded-proto') === 'https' || request.url.startsWith('https://');

                    if (isHttps) {
                      // Try multiple cookie strategies for cross-origin
                      cookieValue += `; Secure; SameSite=None`;

                      // Set the main cookie first
                      set.headers['Set-Cookie'] = cookieValue;
                    } else {
                      // If not HTTPS, use Lax (less secure but works)
                      cookieValue += `; SameSite=Lax`;
                    }

                    // Add domain if specified in environment
                    if (process.env.COOKIE_DOMAIN) {
                      cookieValue += `; Domain=${process.env.COOKIE_DOMAIN}`;
                    }
                  } else {
                    cookieValue += '; SameSite=Lax';
                  }

                  console.log('Setting cookie:', cookieValue);
                  console.log('Request headers during login:', Object.fromEntries(request.headers.entries()));
                  set.headers['Set-Cookie'] = cookieValue;

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
              await db.collection(APP_SESSION_COLLECTION).deleteOne({ _id: new ObjectId(sessionId) });

              set.headers['Set-Cookie'] = 'session_id=; Max-Age=0; Path=/; HttpOnly';

              return { success: true };
            } catch (e) {
              console.log(e);
              set.status = 500;
              return { success: false, message: 'Logout failed' };
            }
          })
          .get('/me', async ({ user, set }) => {
            if (!user) {
              set.status = 401;
              return { message: 'Not authenticated' };
            }
            return user;
          })
          .put('/update', () => {})
    );

  return app;
};
