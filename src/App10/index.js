/* eslint-disable no-unused-vars */
import React, { lazy, Suspense } from 'react';
import {
  Route,
  Switch,
  withRouter,
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

window.addEventListener('touchstart', e => {
  needAnimation = true
})
window.addEventListener('touchmove', e => {
  needAnimation = false
})
window.addEventListener('touchend', e => {
  needAnimation = true
})
const routerStack = []
const getClassName = location => {
  const index = routerStack.lastIndexOf(location.pathname)
  const isLastRoute = index >= 0 && index === routerStack.length - 2
  const className = isLastRoute ? 'back' : 'forward'
  if (isLastRoute) routerStack.pop()
  else routerStack.push(location.pathname)
  console.log(location.pathname, [...routerStack])
  if(!needAnimation) return ''
  return className
}
const Routes = withRouter(({location, history}) => {
  const classNames = getClassName(location);
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
});


export default () => <BrowserRouter hashType="noslash">
  <Routes/>
</BrowserRouter>