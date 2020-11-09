/* eslint-disable no-unused-vars */
// 记录页面跳转的解决方案
import React, { lazy, Suspense } from 'react';
import {
  Route,
  Switch,
  BrowserRouter, HashRouter
} from 'react-router-dom';
import { Spin } from 'antd'
import './index.css';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import { HomePage, AboutPage } from '../Pages/index';
const DetailPage = lazy(() => import('../Pages/DetailPage'))
const ListPage = lazy(async () => {
  await new Promise(resolve => window.setTimeout(resolve, 300))
  return import('../Pages/ListPage')
})
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

const routerStack = (sessionStorage.getItem('ROUTER_STACK') || '').split(',').filter(Boolean)

const getClassName = location => {
  if(!needAnimation) return ''
  const index = routerStack.lastIndexOf(location.pathname) // 这里要找出现的最后一条记录
  if (index >= 0 && routerStack.length - 1 === index) return 'forward' // 重复打开同样的路由不增加记录
  const isLastRoute = index >= 0 && index === routerStack.length - 2 // 存在且是上一页
  const className = isLastRoute ? 'back' : 'forward'
  if (isLastRoute) routerStack.pop()
  else routerStack.push(location.pathname)
  sessionStorage.setItem('ROUTER_STACK', routerStack.join()) // 更改后随时保存
  return className
}
const render = ({location, history}) => {
  const classNames = getClassName(location)
  delayReset() // 防止某些浏览器不触发touchend
  return <TransitionGroup
    className="router-wrapper"
    childFactory={child => React.cloneElement(
      child,
      { classNames }
    )}
  >
    <CSSTransition
      timeout={500}
      key={location.pathname}
    >
      <div>
        <Suspense fallback={<Spin/>}>
          <Switch location={location}>
            <Route exact path={'/'} component={HomePage} />
            <Route exact path={'/about'} component={AboutPage} />
            <Route exact path={'/list'} render={props => <ListPage {...props}/>} />
            <Route exact path={'/detail/:id(\\d+)'} render={props => <DetailPage {...props}/>}/>
          </Switch>
        </Suspense>
      </div>
    </CSSTransition>
  </TransitionGroup>
}


export default () => <HashRouter>
  <Route path='/' render={render}/>
</HashRouter>
