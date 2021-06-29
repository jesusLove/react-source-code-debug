import React from 'react'
import styles from './App.scss'
import { Switch, Route, Link } from 'react-router-dom'
import SuspenseDemo from './apis/suspense/index'
import HookDemo from './apis/hooks/index'
const routes = [
  {
    title: 'Suspense Demo',
    path: '/',
    exact: true,
    main: SuspenseDemo
  },
  {
    title: 'Hook Demo',
    path: '/hooks',
    main: HookDemo
  },
]
function App() {
  return <div className={styles.appWrapper}>
    <div className={styles.sideWrapper}>
      <ul>
        {routes.map(item => {
          return <li key={item.title} >
            <Link to={item.path}>{item.title}</Link>
          </li>
        })}
      </ul>
    </div>
    <div className={styles.contentWrapper}>
      <Switch>
        {routes.map(item => {
          return <Route
            key={item.title}
            path={item.path}
            exact={item.exact}
            component={item.main}
          />
        })}
      </Switch>
    </div>
  </div>
}
export default App;
