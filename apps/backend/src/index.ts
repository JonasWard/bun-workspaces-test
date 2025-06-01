import { exampleData } from 'core/data/exampleData';
import { type DatabaseType } from 'core/typeSheet';
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { ExampleDataType, registerRoutersOnApp } from 'orm/index';

const app = new Elysia().use(cors()).listen(5000);
const clonedData = { ...exampleData };

const registeredRouters = registerRoutersOnApp<DatabaseType>(app, ExampleDataType, clonedData);

export type App = typeof app;

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
