import React from 'react'
const LazyDemo = React.lazy(() => import('./lazy.js'))

let data = ''
let promise = ''
function requestData() {
  if (data) return data
  if (promise) throw promise
  promise = new Promise(resolve => {
    setTimeout(() => {
      data = 'Hello, Suspense'
      resolve()
    }, 2000)
  })
  throw promise
}
function SuspenseComp() {
  const data = requestData()
  return <span>{data}</span>
}
function SuspenseDemo() {
  // 在 data 加载完成前不会显示 SuspenseComp 组件
  // Suspense 中的组件都加载完成后才会隐藏 loading data
  return <React.Suspense fallback='loading data'>
    <SuspenseComp />
    <LazyDemo />
  </React.Suspense>
}

export default SuspenseDemo