import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { ExampleDataType, registerRoutersOnAppForDummyData } from 'orm';
import { connectToDatabase } from './database';
import swagger from '@elysiajs/swagger';
import { registerRoutersOnAppForMongoDB } from './mongo/createMongoCalls';
import { exampleData } from 'core';

let db: any;

if (process.env.NO_DATABASE !== 'true') db = await connectToDatabase();

const app = new Elysia().use(cors()).listen(process.env.PORT || 5000);

if (process.env.SWAGGER === 'true')
  app.use(
    swagger({
      path: '/swagger', // endpoint which swagger will appear on
      documentation: {
        info: {
          title: 'Bun.js CRUD app with Elysia.js',
          version: '1.0.0'
        }
      }
    })
  );

if (process.env.NO_DATABASE !== 'true') registerRoutersOnAppForMongoDB(app as any, ExampleDataType, db);
if (process.env.NO_DATABASE === 'true')
  registerRoutersOnAppForDummyData(app as any, ExampleDataType, { ...exampleData });

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
