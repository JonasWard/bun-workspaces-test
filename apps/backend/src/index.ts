import { Elysia, Handler, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { ExampleDataType, registerRoutersOnAppForDummyData } from 'orm';
import { connectToDatabase } from './database';
import swagger from '@elysiajs/swagger';
import { registerRoutersOnAppForMongoDB } from './mongo/createMongoCalls';
import { exampleData } from 'core';
import { registerAppUser } from './appUser';
import { Db } from 'mongodb';

let db: Db | null = null;

if (process.env.NO_DATABASE !== 'true') db = await connectToDatabase();

const app = new Elysia()
  .use(
    cors({
      origin: process.env.FRONT_END!,
      credentials: true
    })
  )
  .listen(process.env.PORT || 5000);

if (process.env.WITH_SWAGGER === 'true') {
  app.use(
    swagger({
      path: 'swagger', // endpoint which swagger will appear on
      documentation: {
        info: {
          title: 'Bun.js CRUD app with Elysia.js',
          version: '1.0.0'
        }
      }
    })
  );
  console.log('registered Swagger');
}

if (process.env.NO_DATABASE !== 'true') {
  if (!db) console.log('db was not initialised for some reason!');
  else {
    registerRoutersOnAppForMongoDB(
      process.env.WITH_AUTH === 'true' ? registerAppUser(app, db) : app,
      ExampleDataType,
      db
    );
    console.log('registered MongoDB endpoints');
  }
}

if (process.env.NO_DATABASE === 'true') {
  registerRoutersOnAppForDummyData(app as any, ExampleDataType, { ...exampleData });
  console.log('registered Boilerplate endpoints');
}

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
