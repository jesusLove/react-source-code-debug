# React.Children

## map 的实现

```js
React.Children.map(children, function[(thisArg)])
```

在 children 里的每个直接子节点上调用一个函数，并将 this 设置为 thisArg。
如果 children 是一个数组，它将被遍历并为数组中的每个子节点调用该函数。
如果子节点为 null 或是 undefined，则此方法将返回 null 或是 undefined，而不会返回数组。

源码 `ReactChildren.js` 文件中的`mapChildren` 方法，实现流程如下：

```js
function mapChildren(
  children: ?ReactNodeList,
  func: MapFunc,
  context: mixed,
): ?Array<React$Node> {
  // children 为 null 直接返回 null 而不是空数组。
  if (children == null) {
    return children;
  }
  const result = [];
  let count = 0;
  mapIntoArray(children, result, '', '', function(child) {
    return func.call(context, child, count++);
  });
  return result;
}
```

下面是 `mapIntoArray` 的源码实现：

```js
function mapIntoArray(
  children: ?ReactNodeList,
  array: Array<React$Node>,
  escapedPrefix: string,
  nameSoFar: string,
  callback: (?React$Node) => ?ReactNodeList,
): number {
  const type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  let invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;
      case 'object':
        switch ((children: any).$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }
    }
  }

  if (invokeCallback) {
    const child = children;
    let mappedChild = callback(child);
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows:
    const childKey =
      nameSoFar === '' ? SEPARATOR + getElementKey(child, 0) : nameSoFar;
    if (Array.isArray(mappedChild)) {
      let escapedChildKey = '';
      if (childKey != null) {
        escapedChildKey = escapeUserProvidedKey(childKey) + '/';
      }
      mapIntoArray(mappedChild, array, escapedChildKey, '', c => c);
    } else if (mappedChild != null) {
      if (isValidElement(mappedChild)) {
        mappedChild = cloneAndReplaceKey(
          mappedChild,
          // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          escapedPrefix +
            // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
            (mappedChild.key && (!child || child.key !== mappedChild.key)
              ? // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
                escapeUserProvidedKey('' + mappedChild.key) + '/'
              : '') +
            childKey,
        );
      }
      array.push(mappedChild);
    }
    return 1;
  }

  let child;
  let nextName;
  let subtreeCount = 0; // Count of children found in the current subtree.
  const nextNamePrefix =
    nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getElementKey(child, i);
      subtreeCount += mapIntoArray(
        child,
        array,
        escapedPrefix,
        nextName,
        callback,
      );
    }
  } else {
    const iteratorFn = getIteratorFn(children);
    if (typeof iteratorFn === 'function') {
      const iterator = iteratorFn.call(children);
      let step;
      let ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getElementKey(child, ii++);
        subtreeCount += mapIntoArray(
          child,
          array,
          escapedPrefix,
          nextName,
          callback,
        );
      }
    } else if (type === 'object') {
      const childrenString = '' + (children: any);
    }
  }
  return subtreeCount;
}
```