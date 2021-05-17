import React from 'react'

function ChildrenComp(props) {
  console.log(props.children)
  console.log(React.Children.map(props.children, c => [c, c]))
  return props.children
}
function ChildrenDemo() {
  return <ChildrenComp>
    <span>1</span>
    <span>2</span>
  </ChildrenComp>
}

export default ChildrenDemo