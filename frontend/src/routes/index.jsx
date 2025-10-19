import { authRoutes } from './authRoutes';
import { publicRoutes } from './publicRoutes';

export const routes = [
  ...publicRoutes,
  ...authRoutes,
];
