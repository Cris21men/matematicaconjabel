import { useState, useRef } from 'react'
import Balloon from './Balloon'
import Confetti from './Confetti'

interface AdditionProps {
  onBack: () => void
}

interface BalloonData {
  id: string
  x: number
  y: number
  color: 'red' | 'blue'
  group: 'first' | 'second'
}

function Addition({ onBack }: AdditionProps) {
  const [firstGroupCount, setFirstGroupCount] = useState(0)
  const [secondGroupCount, setSecondGroupCount] = useState(0)
  const [balloons, setBalloons] = useState<BalloonData[]>([])
  const [isLocked, setIsLocked] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [answers, setAnswers] = useState<number[]>([])
  
  const firstZoneRef = useRef<HTMLDivElement>(null)
  const secondZoneRef = useRef<HTMLDivElement>(null)

  const numberToWords = (num: number): string => {
    const words = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez']
    return words[num] || num.toString()
  }

  const generateAnswers = (correct: number) => {
    const answers = [correct]
    while (answers.length < 3) {
      const wrong = correct + Math.floor(Math.random() * 6) - 3
      if (wrong > 0 && wrong <= 20 && !answers.includes(wrong)) {
        answers.push(wrong)
      }
    }
    return answers.sort(() => Math.random() - 0.5)
  }

  const handleZoneClick = (e: React.MouseEvent, zone: 'first' | 'second') => {
    if (isLocked) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - 16
    const y = e.clientY - rect.top - 20

    const newBalloon: BalloonData = {
      id: `${zone}-${Date.now()}-${Math.random()}`,
      x,
      y,
      color: zone === 'first' ? 'red' : 'blue',
      group: zone
    }

    setBalloons(prev => [...prev, newBalloon])

    if (zone === 'first') {
      setFirstGroupCount(prev => prev + 1)
    } else {
      setSecondGroupCount(prev => prev + 1)
    }
  }

  const handleEqualsClick = () => {
    if (firstGroupCount === 0 && secondGroupCount === 0) return
    
    setIsLocked(true)
    const total = firstGroupCount + secondGroupCount
    setAnswers(generateAnswers(total))
  }

  const handleAnswerClick = (answer: number) => {
    if (selectedAnswer !== null) return
    
    setSelectedAnswer(answer)
    const correct = firstGroupCount + secondGroupCount
    
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
    setFirstGroupCount(0)
    setSecondGroupCount(0)
    setBalloons([])
    setIsLocked(false)
    setSelectedAnswer(null)
    setShowConfetti(false)
    setAnswers([])
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-400 via-teal-500 to-blue-600 relative">
      <div className="flex items-center justify-between p-2 md:p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-gradient-to-br from-orange-400 to-red-500 backdrop-blur-sm rounded-full px-4 py-2 md:px-6 md:py-3 text-white font-bold hover:from-orange-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:scale-105 border-2 border-white/30 mobile-landscape-button"
        >
          ← Regresar
        </button>
        
        <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg mobile-landscape-title">➕ SUMA</h1>
        
        <button
          onClick={resetGame}
          className="bg-gradient-to-br from-green-400 to-blue-500 backdrop-blur-sm rounded-full px-4 py-2 md:px-6 md:py-3 text-white font-bold hover:from-green-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:scale-105 border-2 border-white/30 mobile-landscape-button"
        >
          🔄 Nuevo
        </button>
      </div>

      {/* Main Content - Optimizado para móviles horizontal */}
      <div className="flex items-center h-full px-2 md:px-4 pb-4 md:pb-8">
        {/* Primera zona */}
        <div className="flex-[3]">
          <div
            ref={firstZoneRef}
            onClick={(e) => handleZoneClick(e, 'first')}
            className={`operation-zone mobile-landscape-zone ${!isLocked ? 'cursor-pointer hover:bg-white/50' : ''}`}
          >
            {balloons?.filter(b => b.group === 'first').map(balloon => (
              <Balloon
                key={balloon.id}
                id={balloon.id}
                x={balloon.x}
                y={balloon.y}
                color={balloon.color}
              />
            ))}
            {!isLocked && (
              <div className="text-white text-lg md:text-2xl text-center font-bold mobile-landscape-text">
                Haz clic para agregar globos rojos
              </div>
            )}
          </div>
          <div className="text-center mt-2 md:mt-4">
            <div className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mobile-landscape-counter">
              {firstGroupCount} - {numberToWords(firstGroupCount)}
            </div>
          </div>
        </div>

        {/* Botón + compacto */}
        <div className="flex flex-col items-center mx-2 md:mx-4">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/30">
            <span className="text-2xl md:text-3xl font-bold text-white">+</span>
          </div>
        </div>

        {/* Segunda zona */}
        <div className="flex-[3]">
          <div
            ref={secondZoneRef}
            onClick={(e) => handleZoneClick(e, 'second')}
            className={`operation-zone mobile-landscape-zone ${!isLocked ? 'cursor-pointer hover:bg-white/50' : ''}`}
          >
            {balloons?.filter(b => b.group === 'second').map(balloon => (
              <Balloon
                key={balloon.id}
                id={balloon.id}
                x={balloon.x}
                y={balloon.y}
                color={balloon.color}
              />
            ))}
            {!isLocked && (
              <div className="text-white text-lg md:text-2xl text-center font-bold mobile-landscape-text">
                Haz clic para agregar globos azules
              </div>
            )}
          </div>
          <div className="text-center mt-2 md:mt-4">
            <div className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mobile-landscape-counter">
              {secondGroupCount} - {numberToWords(secondGroupCount)}
            </div>
          </div>
        </div>

        {/* Botón = compacto */}
        <div className="flex flex-col items-center mx-2 md:mx-4">
          <button
            onClick={handleEqualsClick}
            disabled={isLocked || (firstGroupCount === 0 && secondGroupCount === 0)}
            className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-500 hover:to-blue-600 transition-all duration-300 border-4 border-white/30"
          >
            <span className="text-2xl md:text-3xl font-bold text-white">=</span>
          </button>
        </div>

        {/* Zona de respuestas */}
        <div className="flex-[2]">
          <div className="operation-zone mobile-landscape-zone justify-center">
            {!isLocked ? (
              <div className="text-white text-sm md:text-lg text-center font-bold mobile-landscape-text">
                Presiona = cuando termines
              </div>
            ) : (
              <div className="flex flex-col gap-3 md:gap-4 items-center">
                <div className="text-white text-base md:text-xl font-bold mb-2 md:mb-4 text-center mobile-landscape-text">
                  ¿Cuántos globos hay en total?
                </div>
                <div className="flex flex-col gap-2 md:gap-4">
                  {answers.map((answer) => (
                    <button
                      key={answer}
                      onClick={() => handleAnswerClick(answer)}
                      disabled={selectedAnswer !== null}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-full text-2xl md:text-3xl font-bold transition-all duration-300 shadow-lg ${
                        selectedAnswer === answer
                          ? answer === firstGroupCount + secondGroupCount
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

      <Confetti isActive={showConfetti} />

      <Confetti isActive={showConfetti} />
    </div>
  )
}

export default Addition