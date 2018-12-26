import { useState, useEffect } from 'react';
//hooks解决的问题在于：解决组件嵌套地狱
//hooks之在函数组件中存在
//hooks将所有生命周期归于useEffect，每一次渲染都会触发
//useMemo对复杂数据进行过滤
export  default  function () {
  //count为状态初始值，通过setCount来进行更新
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
