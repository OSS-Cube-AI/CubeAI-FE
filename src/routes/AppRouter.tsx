import {
  Outlet,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import SomethingWentWrongPage from '@/components/status/error/SomethingWentWrongPage';
import { UnknownErrorBoundary } from '@/components/status/error/UnknownErrorBoundary';
import { APIErrorBoundary } from '@/components/status/error/APIErrorBoundary';
import { Suspense } from 'react';
import Loader from '@/components/status/loading/Loader';
import { ROUTE_TYPE } from '@/constants/path';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

import RootPage from '@/pages/RootPage';
import EditorPage from '@/pages/Editor';

const createAuthRouter = (routeType: ROUTE_TYPE, children: RouteObject[]) => {
  const authRouter = children.map((child: RouteObject) => ({
    element: routeType === 'PRIVATE' ? <PrivateRoute /> : <PublicRoute />,
    children: [child],
  }));
  return authRouter;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <UnknownErrorBoundary>
        <APIErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </APIErrorBoundary>
      </UnknownErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <RootPage />,
      },
      ...createAuthRouter('PRIVATE', [{}]),
      ...createAuthRouter('PUBLIC', [
        {
          path: '/editor',
          element: <EditorPage />,
        }
      ]),
      {
        path: '*',
        element: <SomethingWentWrongPage />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
