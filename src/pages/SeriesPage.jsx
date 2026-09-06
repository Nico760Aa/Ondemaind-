import { useState, useEffect } from "react";
import { Tv, Filter, ChevronDown } from "lucide-react";
import { getSeries, genres } from "../data/catalog";
import ContentCard from "../components/ContentCard";

const seriesList = getSeries();

export default function SeriesPage() {
  const [selectedGenre, setSelectedGenre] = useState("Tutti");
  const [sortBy, setSortBy] = useState("rating");
  const [filtered, setFiltered] = useState(seriesList);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let result =
      selectedGenre === "Tutti"
        ? [...seriesList]
        : seriesList.filter((s) => s.genre.includes(selectedGenre));

    if (sortBy === "rating")
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    else if (sortBy === "year")
      result.sort((a, b) => b.year - a.year);
    else if (sortBy === "title")
      result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "seasons")
      result.sort((a, b) => b.seasons - a.seasons);

    setFiltered(result);
  }, [selectedGenre, sortBy]);

  const seriesGenres = genres.filter((g) =>
    g === "Tutti" || seriesList.some((s) => s.genre.includes(g))
  );

  return (
    <div className="bg-gray-950 min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Tv size={28} className="text-red-500" />
          <h1 className="text-3xl md:text-4xl font-black text-white">Serie TV</h1>
          <span className="bg-gray-800 text-gray-400 text-sm px-3 py-1 rounded-full">
            {filtered.length} serie
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-gray-400 text-sm">Filtra per:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {seriesGenres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedGenre === g
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="relative ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg pl-4 pr-8 py-2 text-sm appearance-none cursor-pointer focus:outline-none focus:border-red-500"
            >
              <option value="rating">Valutazione</option>
              <option value="year">Anno</option>
              <option value="title">Alfabetico</option>
              <option value="seasons">Stagioni</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {filtered.map((s) => (
              <ContentCard key={s.id} item={s} size="normal" />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-2">Nessun risultato</p>
            <p className="text-gray-600 text-sm">Prova con un genere diverso</p>
          </div>
        )}
      </div>
    </div>
  );
}
