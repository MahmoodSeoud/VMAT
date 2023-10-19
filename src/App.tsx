import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Tlb_table from './components/Tlb_table'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Tlb_table />
    </>
  )
}

export default App
