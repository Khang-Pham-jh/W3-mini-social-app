import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import LoginForm from './features/auth/components/LoginForm';
import SignupForm from './features/auth/components/SignupForm';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LoginForm /> },
      { path: 'login', element: <LoginForm /> },
      { path: 'signup', element: <SignupForm /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
