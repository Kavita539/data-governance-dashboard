import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AIRecommendations from './pages/AIRecommendations'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <AIRecommendations />
    </>
  )
}

export default App
