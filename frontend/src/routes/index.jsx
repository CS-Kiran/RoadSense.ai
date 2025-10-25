import { authRoutes } from './authRoutes';
import { publicRoutes } from './publicRoutes';
import { citizenRoutes } from './citizenRoutes';
import { officialRoutes } from './officialRoutes';
import { adminRoutes } from './adminRoutes';  

export const routes = [
  ...publicRoutes,
  ...authRoutes,
  citizenRoutes,
  officialRoutes,
  adminRoutes, 
];
