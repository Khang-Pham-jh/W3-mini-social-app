import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthPage from './features/auth/pages/AuthPage';
import { AuthProvider } from './features/auth/context/AuthContext';
import HomePage from './features/home/pages/HomePage';
import ProtectedRoute from './shared/components/ProtectedRoute';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <AuthPage routeMode="login" /> },
      { path: 'login', element: <AuthPage routeMode="login" /> },
      { path: 'signup', element: <AuthPage routeMode="signup" /> },
      {
        path: 'home',
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
