import { type DatabaseType, exampleData } from 'core';
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { ExampleDataType, registerRoutersOnApp } from 'orm';

const app = new Elysia().use(cors()).listen(process.env.PORT || 5000);
const clonedData = { ...exampleData };

const registeredRouters = registerRoutersOnApp<DatabaseType>(app, ExampleDataType, clonedData);

export type App = typeof app;

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
