import React, { lazy } from 'react';
import { matchPath } from "react-router-dom"
import { HomePage, AboutPage } from '../Pages/index';

const ListPage = lazy(async () => {
  await new Promise(resolve => window.setTimeout(resolve, 250))
  return import('../Pages/ListPage')
})
const DetailPage = lazy(() => import('../Pages/DetailPage'))
// 只需要配置页面级的路由，其他动态路由可以不用在这里配置
export const RouterConfig = [
  {
    path: '/',
    render: props => <HomePage {...props} />,
    meta: {
      index: 0
    }
  },
  {
    path: '/about',
    render: props => <AboutPage {...props} />,
    meta: {
      index: 2
    }
  },
  {
    path: '/list',
    render: props => <ListPage {...props} />,
    meta: {
      index: 2
    }
  },
  {
    path: '/detail/:id(\\d+)',
    render: props => <DetailPage {...props} />,
    meta: {
      index: 3
    }
  }
];

export const getMatchRouter = (pathname, configs) =>
  configs.find(config => matchPath(pathname, {
    exact: true,
    strict: false,
    ...config
  })
)
