import { RouteObject } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../views/Home';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
];

export default routes; 