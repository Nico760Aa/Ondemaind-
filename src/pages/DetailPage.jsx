import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Check, Star, ArrowLeft, ChevronDown } from "lucide-react";
import { useParams } from "react-router-dom";
import { getById, catalog } from "../data/catalog";
import { useApp } from "../context/AppContext";
import ContentCard from "../components/ContentCard";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleMyList, isInMyList } = useApp();
  const item = getById(id);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedSeason, setSelectedSeason] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Contenuto non trovato</p>
          <button onClick={() => navigate("/")} className="bg-red-600 text-white px-6 py-2 rounded-lg">
            Torna alla home
          </button>
        </div>
      </div>
    );
  }

  const related = catalog
    .filter((c) => c.id !== item.id && c.genre.some((g) => item.genre.includes(g)))
    .slice(0, 8);

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Backdrop Hero */}
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        <img
          src={item.backdrop}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 md:left-8 flex items-center gap-2 text-white bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-black/60 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Indietro</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 -mt-32 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="hidden md:block shrink-0">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-56 rounded-xl shadow-2xl border border-gray-700/50"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                {item.type === "movie" ? "Film" : "Serie TV"}
              </span>
              {item.newRelease && (
                <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                  Nuovo
                </span>
              )}
              <span className="border border-gray-600 text-gray-300 text-xs px-3 py-1 rounded-full">
                {item.ageRating}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
              {item.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <Star size={16} className="text-yellow-400" fill="currentColor" />
                <span className="text-yellow-400 font-bold">{item.rating}</span>
                <span className="text-gray-500 text-sm">/10</span>
              </div>
              <span className="text-gray-400">{item.year}</span>
              <span className="text-gray-400">
                {item.type === "movie"
                  ? item.duration
                  : `${item.seasons} stagioni · ${item.episodes} episodi`}
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-5">
              {item.genre.map((g) => (
                <span
                  key={g}
                  className="bg-gray-800 text-gray-300 text-xs px-3 py-1.5 rounded-full border border-gray-700"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => navigate(`/watch/${item.id}`)}
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-lg font-bold text-base hover:bg-gray-200 transition-all hover:scale-105 shadow-lg"
              >
                <Play size={20} fill="black" />
                {item.type === "movie" ? "Guarda il film" : "Guarda ora"}
              </button>
              <button
                onClick={() => toggleMyList(item)}
                className={`flex items-center gap-2 border px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                  isInMyList(item.id)
                    ? "bg-green-600/20 border-green-500 text-green-400"
                    : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                {isInMyList(item.id) ? (
                  <>
                    <Check size={18} />
                    Nella lista
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    La mia lista
                  </>
                )}
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800 mb-6">
              <div className="flex gap-0">
                {["info", "cast", item.type === "series" ? "episodi" : null]
                  .filter(Boolean)
                  .map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                        activeTab === tab
                          ? "text-white border-red-500"
                          : "text-gray-400 border-transparent hover:text-white"
                      }`}
                    >
                      {tab === "info" ? "Informazioni" : tab === "cast" ? "Cast" : "Episodi"}
                    </button>
                  ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "info" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
                    Trama
                  </h3>
                  <p className="text-gray-200 leading-relaxed">{item.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Regia</h3>
                    <p className="text-white text-sm">{item.director}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Anno</h3>
                    <p className="text-white text-sm">{item.year}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Durata</h3>
                    <p className="text-white text-sm">
                      {item.type === "movie" ? item.duration : `${item.seasons} stagioni`}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Classificazione</h3>
                    <p className="text-white text-sm">{item.ageRating}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cast" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {item.cast.map((actor, i) => (
                  <div
                    key={i}
                    className="bg-gray-800/60 rounded-xl p-3 flex items-center gap-3 border border-gray-700/50"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{
                        background: `hsl(${(actor.charCodeAt(0) * 30) % 360}, 60%, 40%)`,
                      }}
                    >
                      {actor.charAt(0)}
                    </div>
                    <span className="text-gray-300 text-sm leading-tight">{actor}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "episodi" && item.type === "series" && (
              <div>
                {/* Season Selector */}
                <div className="relative inline-block mb-4">
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                    className="bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-2 pr-8 text-sm appearance-none cursor-pointer focus:outline-none focus:border-red-500"
                  >
                    {Array.from({ length: item.seasons }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Stagione {i + 1}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* Episodes List */}
                <div className="space-y-3">
                  {(item.episodesList || []).map((ep) => (
                    <div
                      key={ep.ep}
                      className="flex items-center gap-4 bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 hover:bg-gray-700/50 cursor-pointer group/ep transition-colors"
                      onClick={() => navigate(`/watch/${item.id}`)}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0 group-hover/ep:bg-red-600 transition-colors">
                        <Play size={16} fill="white" className="text-white ml-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">
                          S{selectedSeason}E{ep.ep} · {ep.title}
                        </p>
                        <p className="text-gray-500 text-xs">{ep.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Content */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-white text-2xl font-bold mb-4 px-0">Contenuti simili</h2>
            <div className="flex flex-wrap gap-4">
              {related.map((r) => (
                <ContentCard key={r.id} item={r} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
