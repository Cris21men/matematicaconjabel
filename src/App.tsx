import { useState } from 'react'
import HomePage from './components/HomePage'
import Addition from './components/Addition'
import Subtraction from './components/Subtraction'
import Multiplication from './components/Multiplication'

type OperationType = 'home' | 'addition' | 'subtraction' | 'multiplication'

function App() {
  const [currentOperation, setCurrentOperation] = useState<OperationType>('home')

  const renderCurrentView = () => {
    switch (currentOperation) {
      case 'addition':
        return <Addition onBack={() => setCurrentOperation('home')} />
      case 'subtraction':
        return <Subtraction onBack={() => setCurrentOperation('home')} />
      case 'multiplication':
        return <Multiplication onBack={() => setCurrentOperation('home')} />
      default:
        return <HomePage onSelectOperation={setCurrentOperation} />
    }
  }

  return (
    <div className="w-full h-full">
      {renderCurrentView()}
    </div>
  )
}

export default App