"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Confetti from "./Confetti"

interface MultiplicationProps {
  onBack: () => void
}

interface BalloonGroup {
  id: string
  x: number
  y: number
  color: "green" | "red" | "blue" | "yellow" | "pink" | "purple"
  count: number
  isDragging: boolean
  isInDropZone: boolean
}

function Multiplication({ onBack }: MultiplicationProps) {
  const [firstNumber, setFirstNumber] = useState(0)
  const [secondNumber, setSecondNumber] = useState(0)
  const [balloonGroups, setBalloonGroups] = useState<BalloonGroup[]>([])
  const [totalSum, setTotalSum] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [inputPhase, setInputPhase] = useState<"first" | "second" | "multiply">("first")

  const colors: ("green" | "red" | "blue" | "yellow" | "pink" | "purple")[] = [
    "green",
    "red",
    "blue",
    "yellow",
    "pink",
    "purple",
  ]

  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleNumberInput = (num: number) => {
    if (inputPhase === "first") {
      setFirstNumber(num)
      setInputPhase("second")
    } else if (inputPhase === "second") {
      setSecondNumber(num)
      setInputPhase("multiply")
    }
  }

  const generateGroups = () => {
    if (firstNumber === 0 || secondNumber === 0) return

    const groups = Math.min(firstNumber, secondNumber)
    const balloonsPerGroup = Math.max(firstNumber, secondNumber)

    const newGroups: BalloonGroup[] = []

    const maxColumns = Math.min(3, groups)
    const columns = groups <= 3 ? groups : maxColumns
    const rows = Math.ceil(groups / columns)

    const groupWidth = 160
    const groupHeight = 150
    const startX = 20
    const startY = 80

    for (let i = 0; i < groups; i++) {
      const groupColor = colors[i % colors.length]
      const col = i % columns
      const row = Math.floor(i / columns)

      const x = startX + col * groupWidth
      const y = startY + row * groupHeight

      newGroups.push({
        id: `group-${i}`,
        x: x,
        y: y,
        color: groupColor,
        count: balloonsPerGroup,
        isDragging: false,
        isInDropZone: false,
      })
    }

    setBalloonGroups(newGroups)
    setTotalSum(0) // Reset suma
  }

  useEffect(() => {
    if (inputPhase === "multiply") {
      generateGroups()
    }
  }, [inputPhase, firstNumber, secondNumber])

  const handleGroupMouseDown = (groupId: string, e: React.MouseEvent) => {
    e.preventDefault()

    const group = balloonGroups.find((g) => g.id === groupId)
    if (!group || group.isInDropZone) return

    const offsetX = e.clientX - group.x
    const offsetY = e.clientY - group.y

    setBalloonGroups((prev) => prev.map((group) => (group.id === groupId ? { ...group, isDragging: true } : group)))

    const handleMouseMove = (e: MouseEvent) => {
      setBalloonGroups((prev) =>
        prev.map((group) =>
          group.id === groupId && group.isDragging
            ? { ...group, x: e.clientX - offsetX, y: e.clientY - offsetY }
            : group,
        ),
      )
    }

    const handleMouseUp = (e: MouseEvent) => {
      handleGroupDrop(groupId, e.clientX, e.clientY)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleGroupTouchStart = (groupId: string, e: React.TouchEvent) => {
    e.preventDefault()

    const group = balloonGroups.find((g) => g.id === groupId)
    if (!group || group.isInDropZone) return

    const touch = e.touches[0]
    if (!touch) return

    const offsetX = touch.clientX - group.x
    const offsetY = touch.clientY - group.y

    setBalloonGroups((prev) => prev.map((group) => (group.id === groupId ? { ...group, isDragging: true } : group)))

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (touch) {
        setBalloonGroups((prev) =>
          prev.map((group) =>
            group.id === groupId && group.isDragging
              ? { ...group, x: touch.clientX - offsetX, y: touch.clientY - offsetY }
              : group,
          ),
        )
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0]
      if (touch) {
        handleGroupDrop(groupId, touch.clientX, touch.clientY)
      }
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }

    document.addEventListener("touchmove", handleTouchMove, { passive: false })
    document.addEventListener("touchend", handleTouchEnd)
  }

  const handleGroupDrop = (groupId: string, x: number, y: number) => {
    if (!dropZoneRef.current) return

    const dropZoneRect = dropZoneRef.current.getBoundingClientRect()
    const isInDropZone =
      x >= dropZoneRect.left && x <= dropZoneRect.right && y >= dropZoneRect.top && y <= dropZoneRect.bottom

    if (isInDropZone) {
      // Encontrar el grupo y sumar SOLO SI no estaba ya en la zona
      const group = balloonGroups.find(g => g.id === groupId)
      if (group && !group.isInDropZone) {
        setTotalSum(prev => prev + group.count)
      }
    }

    setBalloonGroups((prev) => {
      const updatedGroups = prev.map((group) => {
        if (group.id === groupId) {
          return { 
            ...group, 
            isDragging: false, 
            isInDropZone: isInDropZone 
          }
        }
        return group
      })

      const allGroupsInZone = updatedGroups.every((group) => group.isInDropZone)
      if (allGroupsInZone && updatedGroups.length > 0) {
        setIsComplete(true)
        setShowConfetti(true)
        setTimeout(() => {
          setTimeout(() => {
            resetGame()
          }, 3000)
        }, 1000)
      }

      return updatedGroups
    })
  }

  const resetGame = () => {
    setFirstNumber(0)
    setSecondNumber(0)
    setBalloonGroups([])
    setTotalSum(0)
    setIsComplete(false)
    setShowConfetti(false)
    setInputPhase("first")
  }

  const renderBalloonGroup = (group: BalloonGroup) => {
    // NO retornar null, siempre mostrar el grupo
    const balloons = []
    const rows = Math.ceil(Math.sqrt(group.count))
    const cols = Math.ceil(group.count / rows)

    const colorMap = {
      green: "bg-green-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      yellow: "bg-yellow-500",
      pink: "bg-pink-500",
      purple: "bg-purple-500",
    }

    const textColorMap = {
      green: "text-green-700",
      red: "text-red-700",
      blue: "text-blue-700",
      yellow: "text-yellow-700",
      pink: "text-pink-700",
      purple: "text-purple-700",
    }

    for (let i = 0; i < group.count; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const balloonX = col * 22 + 6 // Espaciado más compacto
      const balloonY = row * 22 + 6 // Espaciado más compacto

      balloons.push(
        <div
          key={i}
          className={`absolute w-5 h-6 rounded-full ${colorMap[group.color]} border-2 border-white/40 shadow-md`} // Globos más pequeños
          style={{
            left: balloonX,
            top: balloonY,
          }}
        >
          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full" />
        </div>,
      )
    }

    return (
      <div
        key={group.id}
        className={`absolute cursor-pointer transition-transform duration-200 ${
          group.isDragging ? "scale-110 z-50 rotate-3" : "hover:scale-105"
        } ${group.isInDropZone ? "opacity-30" : ""}`}
        style={{
          left: group.x,
          top: group.y,
          width: "120px", // Contenedor más pequeño
          height: "110px", // Contenedor más pequeño
        }}
        onMouseDown={(e) => !group.isInDropZone && handleGroupMouseDown(group.id, e)}
        onTouchStart={(e) => !group.isInDropZone && handleGroupTouchStart(group.id, e)}
      >
        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-2 border-2 border-white/20">{balloons}</div>
        <div className="absolute bottom-[-6px] left-0 right-0 text-center">
          <div
            className={`text-xl font-bold ${textColorMap[group.color]} drop-shadow-lg bg-white/90 rounded-lg px-2 py-1 mx-auto inline-block`} // Texto más pequeño
          >
            {group.count}
          </div>
        </div>
      </div>
    )
  }

  const renderNumberInput = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {inputPhase === "first" ? "Ingresa el primer número (0-9)" : "Ingresa el segundo número (0-9)"}
          </h2>

          <div className="grid grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className="w-16 h-16 bg-white rounded-2xl text-2xl font-bold text-gray-700 hover:bg-blue-50 hover:scale-105 transition-all shadow-lg"
              >
                {num}
              </button>
            ))}
          </div>

          {firstNumber > 0 && <div className="mt-4 text-xl text-white">{firstNumber} × ?</div>}
        </div>
      </div>
    )
  }

  if (inputPhase !== "multiply") {
    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 relative">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-gradient-to-br from-orange-400 to-red-500 backdrop-blur-sm rounded-full px-6 py-3 text-white font-bold hover:from-orange-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:scale-105 border-2 border-white/30"
          >
            ← Regresar
          </button>

          <h1 className="text-4xl font-bold text-white drop-shadow-lg">✖️ MULTIPLICACIÓN</h1>

          <button
            onClick={resetGame}
            className="bg-gradient-to-br from-green-400 to-blue-500 backdrop-blur-sm rounded-full px-6 py-3 text-white font-bold hover:from-green-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:scale-105 border-2 border-white/30"
          >
            🔄 Nuevo
          </button>
        </div>

        {renderNumberInput()}
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-indigo-500 relative">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-gradient-to-br from-orange-400 to-red-500 backdrop-blur-sm rounded-full px-6 py-3 text-white font-bold hover:from-orange-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:scale-105 border-2 border-white/30"
        >
          ← Regresar
        </button>

        <h1 className="text-4xl font-bold text-white drop-shadow-lg">✖️ MULTIPLICACIÓN</h1>

        <button
          onClick={resetGame}
          className="bg-gradient-to-br from-green-400 to-blue-500 backdrop-blur-sm rounded-full px-6 py-3 text-white font-bold hover:from-green-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:scale-105 border-2 border-white/30"
        >
          🔄 Nuevo
        </button>
      </div>

      <div className="flex h-full px-4 pb-4 gap-8">
        <div className="flex-[2] relative" style={{ height: "500px" }}>
          <div className="text-center mb-2">
            <div className="text-2xl font-bold text-white">
              {Math.min(firstNumber, secondNumber)} grupos de {Math.max(firstNumber, secondNumber)} globos
            </div>
            <div className="text-lg text-white/80">Arrastra cada grupo completo a la zona roja →</div>
          </div>

          <div className="relative" style={{ height: "420px", overflow: "visible" }}>
            {balloonGroups.map((group) => renderBalloonGroup(group))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-gray-700">=</span>
          </div>
        </div>

        <div className="flex-[1.5] flex flex-col">
          <div
            ref={dropZoneRef}
            className="flex-1 bg-red-200/50 border-red-300 border-8 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center"
            style={{ minHeight: "400px" }}
          >
            <div className="text-center">
              <div className="text-red-700 text-2xl font-bold mb-4">Zona de Suma Automática</div>
              <div className="text-8xl font-bold text-red-800 mb-4">{totalSum}</div>
              <div className="text-red-600 text-lg">
                {balloonGroups.filter((g) => g.isInDropZone).length} de {balloonGroups.length} grupos
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <div className="text-3xl font-bold text-white drop-shadow-lg">
              {totalSum} -{" "}
              {totalSum <= 10
                ? ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"][totalSum] ||
                  totalSum.toString()
                : totalSum.toString()}
            </div>
          </div>
        </div>
      </div>

      <Confetti isActive={showConfetti} />
    </div>
  )
}

export default Multiplication
