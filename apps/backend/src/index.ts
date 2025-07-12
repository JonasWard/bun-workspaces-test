import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { ExampleDataType } from 'orm';
import { connectToDatabase } from './database';
import swagger from '@elysiajs/swagger';
import { registerRoutersOnAppForMongoDB } from './mongo/createMongoCalls';

const db = await connectToDatabase();

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      path: '/swagger', // endpoint which swagger will appear on
      documentation: {
        info: {
          title: 'Bun.js CRUD app with Elysia.js',
          version: '1.0.0'
        }
      }
    })
  )
  .listen(process.env.PORT || 5000);

registerRoutersOnAppForMongoDB(app as any, ExampleDataType, db);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
