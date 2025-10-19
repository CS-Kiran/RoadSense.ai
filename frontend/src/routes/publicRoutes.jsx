import Landing from '@/pages/Landing';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import PublicMap from '@/pages/PublicMap';

export const publicRoutes = [
  { path: '/', element: <Landing /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/map', element: <PublicMap /> },
];
