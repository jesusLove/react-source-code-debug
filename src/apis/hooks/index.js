import React from 'react'
// 1. 在没有 Hooks 之前，函数组件无 this, 没有生命周期。
// 2. 无法使用 state
// 使用 Hooks 可以实现这个功能。
function HookDemo() {
  const [name, setName] = React.useState('jokcy')
  // 副作用：首次执行和每次更新都会执行。
  // useEffect 是生命周期 componentDidMount 
  // 和 componentUpdate / componentWillUnmont 三个函数的组合
  // React.useEffect(() => {
  //   console.log('component update1')
  // })
  // didMount 和 willUnmont 
  // React.useEffect(() => {
  //   console.log('component update')
  //   return () => {
  //     console.log('component will unmount')
  //   }
  // })
  // 控制 effect 执行，仅在 name  发生改变是执行
  React.useEffect(() => {
    console.log('component update', name)
  }, [name])
  return <div>
    <p>My name is: {name}</p>
    <input type='text'
      value={name}
      onChange={e => setName(e.target.value)} />
  </div>
}

export default HookDemo