interface HomePageProps {
  onSelectOperation: (operation: 'addition' | 'subtraction' | 'multiplication') => void
}

function HomePage({ onSelectOperation }: HomePageProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
      {/* Header */}
      <div className="text-center mb-6 md:mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg animate-bounce mobile-landscape-title">
          🎈 Matemáticas divertidas con Jabel 🎈
        </h1>
        <p className="text-lg md:text-2xl text-white/90 font-semibold mobile-landscape-text">
          ¡Ayuda visual para resolver tus tareas de matemáticas!
        </p>
      </div>

      {/* Operation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-4xl">
        {/* Suma */}
        <button
          onClick={() => onSelectOperation('addition')}
          className="math-button group"
        >
          <div className="text-4xl md:text-6xl mb-2 group-hover:scale-110 transition-transform">➕</div>
          <div className="text-lg md:text-2xl font-bold text-gray-700">SUMA</div>
          <div className="text-sm text-gray-500 mt-1 mobile-landscape-text">Agregar globos</div>
        </button>

        {/* Resta */}
        <button
          onClick={() => onSelectOperation('subtraction')}
          className="math-button group"
        >
          <div className="text-4xl md:text-6xl mb-2 group-hover:scale-110 transition-transform">➖</div>
          <div className="text-lg md:text-2xl font-bold text-gray-700">RESTA</div>
          <div className="text-sm text-gray-500 mt-1 mobile-landscape-text">Quitar globos</div>
        </button>

        {/* Multiplicación */}
        <button
          onClick={() => onSelectOperation('multiplication')}
          className="math-button group"
        >
          <div className="text-4xl md:text-6xl mb-2 group-hover:scale-110 transition-transform">✖️</div>
          <div className="text-lg md:text-2xl font-bold text-gray-700">MULTIPLICACIÓN</div>
          <div className="text-sm text-gray-500 mt-1 mobile-landscape-text">Arrastrar grupos</div>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-6 md:mt-12 text-center">
        <p className="text-white/70 text-base md:text-lg mobile-landscape-text">
          Selecciona la operación que necesitas practicar
        </p>
      </div>
    </div>
  )
}

export default HomePage