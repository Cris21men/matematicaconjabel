import { useEffect, useState } from 'react'

interface ConfettiProps {
  isActive: boolean
  duration?: number
}

function Confetti({ isActive, duration = 3000 }: ConfettiProps) {
  const [pieces, setPieces] = useState<Array<{id: number, x: number, delay: number, color: string}>>([])

  useEffect(() => {
    if (isActive) {
      // Crear 50 piezas de confetti
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Porcentaje del ancho de pantalla
        delay: Math.random() * 1000, // Delay random
        color: [
          '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', 
          '#6c5ce7', '#fd79a8', '#00b894', '#e17055'
        ][Math.floor(Math.random() * 8)]
      }))
      
      setPieces(newPieces)
      
      // Limpiar después de la duración
      const timeout = setTimeout(() => {
        setPieces([])
      }, duration)
      
      return () => clearTimeout(timeout)
    }
  }, [isActive, duration])

  if (!isActive || pieces.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 opacity-90"
          style={{
            left: `${piece.x}%`,
            top: '-10px',
            backgroundColor: piece.color,
            animation: `confetti ${duration / 1000}s linear`,
            animationDelay: `${piece.delay}ms`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      
      {/* Globos de celebración */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`balloon-${i}`}
          className="absolute text-4xl animate-bounce"
          style={{
            left: `${10 + i * 8}%`,
            top: '10%',
            animationDelay: `${i * 200}ms`,
            animationDuration: '2s'
          }}
        >
          🎈
        </div>
      ))}
      
      {/* Mensaje de felicitación */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-yellow-400 text-yellow-900 px-8 py-4 rounded-full text-3xl font-bold shadow-lg animate-bounce">
          ¡Excelente! 🎉
        </div>
      </div>
    </div>
  )
}

export default Confetti