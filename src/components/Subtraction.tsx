import { useState, useRef } from 'react'
import Balloon from './Balloon'
import Confetti from './Confetti'

interface SubtractionProps {
  onBack: () => void
}

interface BalloonData {
  id: string
  x: number
  y: number
  color: 'blue'
  isTransparent: boolean
}

function Subtraction({ onBack }: SubtractionProps) {
  const [totalCount, setTotalCount] = useState(0)
  const [subtractCount, setSubtractCount] = useState(0)
  const [balloons, setBalloons] = useState<BalloonData[]>([])
  const [isSubtracting, setIsSubtracting] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  
  const balloonZoneRef = useRef<HTMLDivElement>(null)

  const numberToWords = (num: number): string => {
    const words = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez']
    return words[num] || num.toString()
  }

  const generateAnswers = (correct: number) => {
    const answers = [correct]
    while (answers.length < 3) {
      const wrong = correct + Math.floor(Math.random() * 6) - 3
      if (wrong >= 0 && wrong <= 20 && !answers.includes(wrong)) {
        answers.push(wrong)
      }
    }
    return answers.sort(() => Math.random() - 0.5)
  }

  const handleBalloonZoneClick = (e: React.MouseEvent) => {
    if (isSubtracting || isLocked) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - 16
    const y = e.clientY - rect.top - 20

    const newBalloon: BalloonData = {
      id: `balloon-${Date.now()}-${Math.random()}`,
      x,
      y,
      color: 'blue',
      isTransparent: false
    }

    setBalloons(prev => [...prev, newBalloon])
    setTotalCount(prev => prev + 1)
  }

  const handleBalloonClick = (balloonId: string) => {
    if (!isSubtracting || isLocked) return

    setBalloons(prev => 
      prev.map(balloon => 
        balloon.id === balloonId && !balloon.isTransparent
          ? { ...balloon, isTransparent: true }
          : balloon
      )
    )
    
    setSubtractCount(prev => prev + 1)
  }

  const handleMinusClick = () => {
    if (totalCount === 0) return
    setIsSubtracting(true)
  }

  const handleEqualsClick = () => {
    if (!isSubtracting || subtractCount === 0) return
    
    setIsLocked(true)
    const result = totalCount - subtractCount
    setAnswers(generateAnswers(result))
  }

  const handleAnswerClick = (answer: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answer)
    const correct = totalCount - subtractCount
    
    if (answer === correct) {
      setShowConfetti(true)
      setTimeout(() => {
        setTimeout(() => {
          resetGame()
        }, 3000)
      }, 1000)
    } else {
      setTimeout(() => {
        setSelectedAnswer(null)
      }, 1000)
    }
  }

  const resetGame = () => {
    setTotalCount(0)
    setSubtractCount(0)
    setBalloons([])
    setIsSubtracting(false)
    setIsLocked(false)
    setSelectedAnswer(null)
    setShowConfetti(false)
    setAnswers([])
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 relative">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-gradient-to-br from-orange-400 to-red-500 backdrop-blur-sm rounded-full px-6 py-3 text-white font-bold hover:from-orange-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:scale-105 border-2 border-white/30"
        >
          ← Regresar
        </button>
        
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">➖ RESTA</h1>
        
        <button
          onClick={resetGame}
          className="bg-gradient-to-br from-green-400 to-blue-500 backdrop-blur-sm rounded-full px-6 py-3 text-white font-bold hover:from-green-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:scale-105 border-2 border-white/30"
        >
          🔄 Nuevo
        </button>
      </div>

      <div className="flex items-center h-full px-8 pb-20">
        <div className="flex-[2]">
          <div
            ref={balloonZoneRef}
            onClick={handleBalloonZoneClick}
            className={`operation-zone h-80 ${!isSubtracting && !isLocked ? 'cursor-pointer hover:bg-white/50' : ''}`}
          >
            {balloons.map(balloon => (
              <Balloon
                key={balloon.id}
                id={balloon.id}
                x={balloon.x}
                y={balloon.y}
                color="blue"
                isTransparent={balloon.isTransparent}
                onClick={isSubtracting ? handleBalloonClick : undefined}
              />
            ))}
            {!isSubtracting && !isLocked && (
              <div className="text-white text-xl text-center font-bold">
                Haz clic para agregar globos azules
              </div>
            )}
            {isSubtracting && !isLocked && (
              <div className="text-white text-xl text-center font-bold">
                Toca los globos para hacerlos transparentes
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center mx-6 gap-4">
          <button
            onClick={handleMinusClick}
            disabled={totalCount === 0 || isSubtracting}
            className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 border-4 border-white/30"
          >
            <span className="text-4xl font-bold text-white">−</span>
          </button>
          
          <button
            onClick={handleEqualsClick}
            disabled={!isSubtracting || subtractCount === 0 || isLocked}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-500 hover:to-blue-600 transition-all duration-300 border-4 border-white/30"
          >
            <span className="text-4xl font-bold text-white">=</span>
          </button>
        </div>

        <div className="flex-1">
          <div className="operation-zone h-80 justify-center">
            {!isLocked ? (
              <div className="text-white text-lg text-center font-bold">
                {!isSubtracting 
                  ? "Agrega globos y presiona −" 
                  : "Toca globos para hacerlos transparentes, luego presiona ="
                }
              </div>
            ) : (
              <div className="flex flex-col gap-6 items-center">
                <div className="text-white text-xl font-bold text-center">
                  ¿Cuántos globos quedan?
                </div>
                <div className="flex flex-col gap-3">
                  {answers.map((answer) => (
                    <button
                      key={answer}
                      onClick={() => handleAnswerClick(answer)}
                      disabled={selectedAnswer !== null}
                      className={`w-16 h-16 rounded-full text-2xl font-bold transition-all duration-300 shadow-lg ${
                        selectedAnswer === answer
                          ? answer === totalCount - subtractCount
                            ? 'bg-green-500 text-white animate-bounce scale-110'
                            : 'bg-red-500 text-white'
                          : 'bg-white text-gray-800 hover:bg-yellow-200 hover:scale-105'
                      }`}
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-8 py-4 text-gray-800 font-bold text-2xl text-center shadow-xl max-w-2xl mx-auto">
          {totalCount} - {numberToWords(totalCount)} menos {subtractCount} - {numberToWords(subtractCount)}
        </div>
      </div>

      <Confetti isActive={showConfetti} />
    </div>
  )
}

export default Subtraction