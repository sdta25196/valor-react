import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (<div><A /></div>)
}

function A() {
  return <span>hello666</span>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
