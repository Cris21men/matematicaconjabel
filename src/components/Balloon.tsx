import { useState } from 'react'

interface BalloonProps {
  id: string
  x: number
  y: number
  color: 'red' | 'blue' | 'green' | 'yellow' | 'pink' | 'purple'
  isTransparent?: boolean
  isDraggable?: boolean
  onPop?: (id: string) => void
  onDragStart?: (id: string) => void
  onDrag?: (id: string, x: number, y: number) => void
  onDragEnd?: (id: string, x: number, y: number) => void
  onClick?: (id: string) => void
}

function Balloon({
  id,
  x,
  y,
  color,
  isTransparent = false,
  isDraggable = false,
  onPop,
  onDragStart,
  onDrag,
  onDragEnd,
  onClick
}: BalloonProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isPopping, setIsPopping] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (isDraggable && onDragStart) {
      setIsDragging(true)
      onDragStart(id)
      
      const handleMouseMove = (e: MouseEvent) => {
        if (onDrag) {
          onDrag(id, e.clientX, e.clientY)
        }
      }
      
      const handleMouseUp = (e: MouseEvent) => {
        setIsDragging(false)
        if (onDragEnd) {
          onDragEnd(id, e.clientX, e.clientY)
        }
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else if (onClick) {
      onClick(id)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    
    if (isDraggable && onDragStart) {
      setIsDragging(true)
      onDragStart(id)
      
      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0]
        if (onDrag && touch) {
          onDrag(id, touch.clientX, touch.clientY)
        }
      }
      
      const handleTouchEnd = (e: TouchEvent) => {
        setIsDragging(false)
        const touch = e.changedTouches[0]
        if (onDragEnd && touch) {
          onDragEnd(id, touch.clientX, touch.clientY)
        }
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    } else if (onClick) {
      onClick(id)
    }
  }

  const handlePop = () => {
    if (onPop && !isTransparent) {
      setIsPopping(true)
      setTimeout(() => {
        onPop(id)
      }, 300)
    }
  }

  const balloonClasses = [
    'balloon',
    color,
    isTransparent ? 'transparent' : '',
    isDragging ? 'dragging' : '',
    isPopping ? 'animate-balloon-pop' : 'animate-bounce-in'
  ].filter(Boolean).join(' ')

  return (
    <div
      className={balloonClasses}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        zIndex: isDragging ? 1000 : 10
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDoubleClick={handlePop}
    >
      {/* Balloon string */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-px h-4 bg-gray-400" />
      
      {/* Highlight */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full" />
    </div>
  )
}

export default Balloon