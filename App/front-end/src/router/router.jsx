import { createBrowserRouter, Navigate } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: 'register',
        element: <RegisterForm />,
      },
      {
        path: '/profile/:username',
        element: <ProfilePage />,
      },
      {
        path: '/book',
        element: <BookingPage />,
      },
      {
        path: '/book-room/:roomId',
        element: <RoomBookingPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
