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

const ANIMATION_MAP = needAnimation => ({
  PUSH: needAnimation ? 'forward' : '',
  POP: needAnimation ? 'back' : '',
  REPLACE: 'forward'
})

const Routes = withRouter(({location, history}) => (
  <TransitionGroup
    className="router-wrapper"
    childFactory={child => React.cloneElement(
      child,
      {classNames: ANIMATION_MAP(needAnimation)[history.action]}
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
));


export default () => <BrowserRouter hashType="noslash">
  <Routes/>
</BrowserRouter>