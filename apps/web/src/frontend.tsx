/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { createRoot } from 'react-dom/client';
import { App } from './App';
import { createHashRouter, RouterProvider } from 'react-router';
import { Missing } from './components/general/Missing';
import './customising-styling.css';
import { NestedDataForObjectRenderer } from './components/data/NestedDataForObjectRenderer';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { WithBackendCall } from './components/data/content/WithBackendCall';
import { BackendHealthCheck } from './components/general/BackendHealthCheck';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

let router = createHashRouter([
  {
    path: '/login',
    Component: LoginForm
  },
  {
    path: '/register',
    Component: RegisterForm
  },
  {
    path: '/',
    element: <ProtectedRoute children={<App />} />
  },
  {
    path: '/get/:collection/:id',
    element: <ProtectedRoute children={<WithBackendCall />} />
  },
  {
    path: '/:collectionName/:id',
    element: <ProtectedRoute children={<NestedDataForObjectRenderer />} />
  },
  {
    path: '*',
    Component: Missing
  }
]);

function start() {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <BackendHealthCheck>
      <RouterProvider router={router} />
    </BackendHealthCheck>
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
