```js
export function lazy<T>(
  ctor: () => Thenable<{default: T, ...}>,
): LazyComponent<T, Payload<T>> {
  const payload: Payload<T> = {
    // We use these fields to store the result.
    _status: -1,
    _result: ctor,
  };
  const lazyType: LazyComponent<T, Payload<T>> = {
    $$typeof: REACT_LAZY_TYPE,
    _payload: payload,
    _init: lazyInitializer,
  };
  return lazyType;
}
```
lazy 是一个方法返回一个对象。

```js
// @flow 定义 lazy 返回值的类型
export type LazyComponent<T, P> = {
  $$typeof: Symbol | number,
  _payload: P,
  _init: (payload: P) => T,
};
// => 
{
  $$typeof: REACT_LAZY_TYPE, // 类型标识
  _payload: {
    _status: -1,
    _result: ctor, // 该字段用来保存结果
  },
  _init: lazyInitializer, // 
}
```
主要看一下 `lazyInitialier` 方法中具体做了什么？首先是一个状态常量定义，在 `ReactLazy.js` 中定义了四种状态：

```js
const Uninitialized = -1; // 未初始化
// 下面三种对应的 Promise 的状态
const Pending = 0; // 进行中
const Resolved = 1; // 已成功
const Rejected = 2; // 已失败
```

`lazyInitialier` 中对这四种状态进行处理。源码如下：

```js
function lazyInitializer<T>(payload: Payload<T>): T {
  // 未初始化状态
  if (payload._status === Uninitialized) {
    // 获取传入的函数
    const ctor = payload._result;
    // 执行函数，将结果赋值给 thenable
    // 此时 thenable 是一个 Promise，import(./x.js) 返回一个 Promise
    const thenable = ctor();
    // 进入下一个状态 Pending
    const pending: PendingPayload = (payload: any);
    pending._status = Pending;
    pending._result = thenable;
    thenable.then(
      moduleObject => {
        // 从 Pending -> Resolved 状态
        if (payload._status === Pending) {
          // 读取值，就是组件
          const defaultExport = moduleObject.default;
          // 下一个状态，Resolved 
          const resolved: ResolvedPayload<T> = (payload: any);
          resolved._status = Resolved;
          resolved._result = defaultExport;
        }
      },
      error => {
        // 从 Pending -> Rejected 状态
        if (payload._status === Pending) {
          const rejected: RejectedPayload = (payload: any);
          rejected._status = Rejected;
          rejected._result = error;
        }
      },
    );
  }
  // 如果已经是完成状态，直接读取 result 中的组件渲染即可。
  if (payload._status === Resolved) {
    return payload._result;
  } else {
    throw payload._result;
  }
}
```
