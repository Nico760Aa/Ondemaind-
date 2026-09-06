import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Info, Plus, Check, Volume2, VolumeX } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Hero({ items }) {
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();
  const { toggleMyList, isInMyList } = useApp();
  const timerRef = useRef(null);

  const item = items[current];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % items.length);
        setAnimating(false);
      }, 500);
    }, 8000);
    return () => clearInterval(timerRef.current);
  }, [items.length]);

  const goTo = (idx) => {
    clearInterval(timerRef.current);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  };

  return (
    <div className="relative w-full h-[75vh] md:h-[85vh] min-h-[500px] overflow-hidden">
      {/* Background Image */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${animating ? "opacity-0" : "opacity-100"}`}
      >
        <img
          src={item.backdrop}
          alt={item.title}
          className="w-full h-full object-cover object-center"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/30" />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24 px-6 md:px-16 max-w-3xl transition-all duration-500 ${
          animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {item.type === "movie" ? "🎬 Film" : "📺 Serie TV"}
          </span>
          {item.newRelease && (
            <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Nuovo
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-3 leading-none drop-shadow-2xl">
          {item.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-green-400 font-bold text-sm">⭐ {item.rating}</span>
          <span className="text-gray-300 text-sm">{item.year}</span>
          <span className="border border-gray-500 text-gray-300 text-xs px-2 py-0.5 rounded">
            {item.ageRating}
          </span>
          <span className="text-gray-300 text-sm">
            {item.type === "movie" ? item.duration : `${item.seasons} stagioni`}
          </span>
          <div className="flex flex-wrap gap-2">
            {item.genre.map((g) => (
              <span key={g} className="text-gray-400 text-xs bg-gray-800/60 px-2 py-0.5 rounded">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-lg line-clamp-3">
          {item.description}
        </p>

        {/* Buttons */}
        <div className="flex items-center flex-wrap gap-3">
          <button
            onClick={() => navigate(`/watch/${item.id}`)}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold text-sm md:text-base hover:bg-gray-200 transition-all duration-200 shadow-lg hover:scale-105"
          >
            <Play size={18} fill="black" />
            <span>Guarda ora</span>
          </button>

          <button
            onClick={() => navigate(`/detail/${item.id}`)}
            className="flex items-center gap-2 bg-gray-700/70 backdrop-blur-sm text-white border border-gray-600 px-6 py-3 rounded-lg font-bold text-sm md:text-base hover:bg-gray-600/80 transition-all duration-200"
          >
            <Info size={18} />
            <span>Dettagli</span>
          </button>

          <button
            onClick={() => toggleMyList(item)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700/70 backdrop-blur-sm border border-gray-600 text-white hover:bg-gray-600/80 transition-all duration-200"
            title={isInMyList(item.id) ? "Rimuovi dalla lista" : "Aggiungi alla lista"}
          >
            {isInMyList(item.id) ? <Check size={18} className="text-green-400" /> : <Plus size={18} />}
          </button>

          <button
            onClick={() => setMuted(!muted)}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700/70 backdrop-blur-sm border border-gray-600 text-white hover:bg-gray-600/80 transition-all duration-200 ml-auto"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 right-8 flex items-center gap-2 z-10">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-6 h-2 bg-red-500"
                : "w-2 h-2 bg-gray-500 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
