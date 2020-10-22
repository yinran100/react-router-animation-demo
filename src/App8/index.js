/* eslint-disable no-unused-vars */
import React, { lazy, Suspense } from 'react';
import { RouterConfig, getMatchRouter } from './RouteConfig';

import {
  Route,
  Switch,
  withRouter,
  BrowserRouter
} from 'react-router-dom';
import { Spin } from 'antd'
import './index.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

let needAnimation = true // 控制滑动自带动画冲突

window.addEventListener('touchstart', e => {
  needAnimation = true
})
window.addEventListener('touchmove', e => {
  needAnimation = false
})
window.addEventListener('touchend', e => {
  needAnimation = true
})

// 通过判断两个路由配置的index，来计算出使用前进还是后退的动画
const getClassName = (location, oldLocation) => {
  // 根据前后两个页面的location.pathname,得到对应的配置自定义参数meta
  const currentRoute = getMatchRouter(location.pathname, RouterConfig) || {};
  const oldRoute = getMatchRouter(oldLocation.pathname, RouterConfig) || {};
  const currentIndex = currentRoute.meta && currentRoute.meta.index
  const oldIndex = oldRoute.meta && oldRoute.meta.index
  if(!needAnimation || oldIndex === currentIndex) return ''
  return oldIndex > currentIndex ? 'back' : 'forward'
}

let oldLocation = {}
const Routes = withRouter(({location, history, match}) => {
  const classNames = getClassName(location, oldLocation);
  // console.log(classNames)
  // 更新旧location
  oldLocation = location;
  return <TransitionGroup
    className="router-wrapper"
    childFactory={child => React.cloneElement(
      child,
      { classNames }
    )}
  >
    <CSSTransition timeout={500} key={location.pathname} >
      <div>
        <Suspense fallback={<Spin/>}>
          <Switch location={location}>
            {
              RouterConfig.map((config, index) => (
                <Route exact key={index} {...config}/>
              ))
            }
          </Switch>
        </Suspense>
      </div>
    </CSSTransition>
  </TransitionGroup>
});


export default props => <BrowserRouter>
  <Routes {...props}/>
</BrowserRouter>
