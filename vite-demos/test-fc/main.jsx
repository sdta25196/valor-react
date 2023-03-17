import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [num, setNum] = useState(5)
  return (<div>{num}</div>)
}

function A() {
  return <span>hello666</span>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
