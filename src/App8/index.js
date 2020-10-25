/* eslint-disable no-unused-vars */
// 配置页面层级的解决方案
import React, { lazy, Suspense } from 'react';
import { RouterConfig, getMatchRouter } from './RouteConfig';

import {
  Route,
  Switch,
  BrowserRouter
} from 'react-router-dom';
import { Spin } from 'antd'
import './index.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

let needAnimation = true // 控制滑动自带动画冲突

const delayReset = () => { // 延后重置控制参数
  setTimeout(() => {
    needAnimation = true
  }, 16)
}
window.addEventListener('touchstart', e => {
  needAnimation = true
})
window.addEventListener('touchmove', e => {
  needAnimation = false
})
window.addEventListener('touchend', delayReset)


// 通过判断两个路由配置的index，来计算出使用前进还是后退的动画
const getClassName = (location, oldLocation) => {
  // 根据前后两个页面的location.pathname,得到对应的配置自定义参数meta
  const currentRoute = getMatchRouter(location.pathname, RouterConfig) || {};
  const oldRoute = getMatchRouter(oldLocation.pathname, RouterConfig) || {};
  const currentIndex = currentRoute.meta && currentRoute.meta.index
  const oldIndex = oldRoute.meta && oldRoute.meta.index
  if(!needAnimation || oldIndex === currentIndex) return '' // 同级跳转，或者滑动中，不执行动画
  return oldIndex > currentIndex ? 'back' : 'forward'
}

let oldLocation = {}
window.onpopstate = console.log
const render = ({location, history}) => {
  const classNames = getClassName(location, oldLocation);
  delayReset() // 防止某些浏览器不触发touchend
  console.log(history.length, history.action)
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
}

export default props => <BrowserRouter>
  <Route path='/' render={render}/>
</BrowserRouter>
