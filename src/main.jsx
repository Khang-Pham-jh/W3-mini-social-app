import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import App from './App.jsx';
import { store } from './app/store';
import AuthPage from './features/auth/pages/AuthPage';
import { AuthProvider } from './features/auth/context/AuthContext';
import HomePage from './features/home/pages/HomePage';
import ProfileEditPage from './features/profile/pages/ProfileEditPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import ProtectedRoute from './shared/components/ProtectedRoute';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AUTH_MODES } from './shared/constants/auth.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <AuthPage routeMode={AUTH_MODES.LOGIN} /> },
      { path: 'login', element: <AuthPage routeMode={AUTH_MODES.LOGIN} /> },
      { path: 'signup', element: <AuthPage routeMode={AUTH_MODES.SIGNUP} /> },
      {
        path: 'home',
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/edit',
        element: (
          <ProtectedRoute>
            <ProfileEditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile/:id',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
