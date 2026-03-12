import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Check, Info, Star } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function ContentCard({ item, size = "normal" }) {
  const [hovered, setHovered] = useState(false);
  const { toggleMyList, isInMyList } = useApp();
  const navigate = useNavigate();

  const widthClass =
    size === "large"
      ? "min-w-[220px] md:min-w-[260px]"
      : size === "small"
      ? "min-w-[140px] md:min-w-[160px]"
      : "min-w-[170px] md:min-w-[200px]";

  return (
    <div
      className={`${widthClass} relative flex-shrink-0 cursor-pointer group/card`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster */}
      <div className="relative rounded-lg overflow-hidden aspect-[2/3] bg-gray-800">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.newRelease && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              NUOVO
            </span>
          )}
          {item.type === "series" && (
            <span className="bg-blue-600/80 text-white text-[10px] px-1.5 py-0.5 rounded">
              Serie
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5">
          <Star size={10} className="text-yellow-400" fill="currentColor" />
          <span className="text-white text-[10px] font-semibold">{item.rating}</span>
        </div>

        {/* Hover Actions */}
        {hovered && (
          <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/watch/${item.id}`)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white text-black py-2 rounded-md text-xs font-bold hover:bg-gray-100 transition-colors"
              >
                <Play size={14} fill="black" />
                Guarda
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleMyList(item); }}
                className="w-9 flex items-center justify-center bg-gray-700/80 border border-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                title={isInMyList(item.id) ? "Rimuovi" : "Aggiungi"}
              >
                {isInMyList(item.id) ? (
                  <Check size={14} className="text-green-400" />
                ) : (
                  <Plus size={14} />
                )}
              </button>
              <button
                onClick={() => navigate(`/detail/${item.id}`)}
                className="w-9 flex items-center justify-center bg-gray-700/80 border border-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                <Info size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Title below card */}
      <div className="mt-2 px-1">
        <p className="text-white text-sm font-medium truncate">{item.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-gray-400 text-xs">{item.year}</span>
          {item.type === "series" && (
            <span className="text-gray-500 text-xs">{item.seasons} stag.</span>
          )}
          {item.type === "movie" && (
            <span className="text-gray-500 text-xs">{item.duration}</span>
          )}
        </div>
      </div>
    </div>
  );
}
