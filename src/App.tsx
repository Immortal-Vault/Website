import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <div>
        <a target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Immortal Vault</h1>
      <h2>Will be soon...</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Сount is {count}
        </button>
      </div>
    </>
  )
}

export default App
