/* eslint-disable no-unused-vars */
// 基础解决方案，优化了动画冲突和懒加载等问题
import React, { lazy, Suspense } from 'react';
import {
  Route,
  Switch,
  BrowserRouter
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

const ANIMATION_MAP = { // 动画类名
  PUSH: 'forward',
  POP: 'back',
  REPLACE: 'forward',
}
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

const render = ({location, history}) => {
  delayReset() // 防止某些浏览器不触发touchend
  return (
  <TransitionGroup
    className="router-wrapper"
    childFactory={child => React.cloneElement(
      child,
      { classNames: needAnimation ? ANIMATION_MAP[history.action] : '' }
    )}
  >
    <CSSTransition
      timeout={300}
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
)}
export default () => <BrowserRouter>
  <Route path='/' render={render}/>
</BrowserRouter>