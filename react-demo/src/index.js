import React from 'react';
import ReactDOM from 'react-dom';


// const jsx = <div>valor-react</div>

function App() {
  return (<div><A /></div>)
}

function A() {
  return <span>hello666</span>
}

const root = document.querySelector("#root")

ReactDOM.createRoot(root).render(<App />)

// console.log(React)

// console.log(App)
// console.log(<App />)

// console.log(ReactDOM)
