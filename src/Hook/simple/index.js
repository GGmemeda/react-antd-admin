import React, {useState, useEffect, useReducer} from 'react';
import {refreshUser} from "../../redux/actions/login";
import { useSelector, useDispatch } from "react-redux";
// eslint-plugin-react-hooks 中的 exhaustive-deps 规则
function Example(props) {
  const loginUserData = useSelector(state => state.loginUser.data);
  const dispatch = useDispatch();
  // 声明一个叫 “count” 的 state 变量。
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([{text: '学习 Hook'}]);
  console.log(todos);
  // 相当于class componentDidMount 和 componentDidUpdate:生命周期的合并
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });
  useEffect(() => {
    console.log('我只调用一次相当于componentDidMount');
  }, []);
  const onButtonClick = () => {
    console.log('进来了');
    dispatch(refreshUser({data:11}));
  };
  return (
    <div>
      <div>{JSON.stringify(loginUserData)}</div>
      <button onClick={onButtonClick}>点击改变redux</button>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
export default Example;
