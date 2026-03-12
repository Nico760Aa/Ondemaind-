import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { searchCatalog } from "../data/catalog";
import ContentCard from "../components/ContentCard";
import { useApp } from "../context/AppContext";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { setSearchQuery, setIsSearchOpen } = useApp();
  const [results, setResults] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSearchOpen(true);
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    if (query.length >= 1) {
      setResults(searchCatalog(query));
    } else {
      setResults([]);
    }
    setSearchQuery(query);
  }, [query]);

  return (
    <div className="bg-gray-950 min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Search size={24} className="text-red-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {query ? (
              <>
                Risultati per{" "}
                <span className="text-red-400">"{query}"</span>
              </>
            ) : (
              "Cerca"
            )}
          </h1>
          {results.length > 0 && (
            <span className="bg-gray-800 text-gray-400 text-sm px-3 py-1 rounded-full">
              {results.length} risultati
            </span>
          )}
        </div>

        {/* Results */}
        {query && results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {results.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-6">
              <X size={40} className="text-gray-600" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-3">Nessun risultato</h2>
            <p className="text-gray-400">
              Non abbiamo trovato nulla per "{query}".
              <br />
              Prova con un titolo o genere diverso.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-6">
              <Search size={40} className="text-gray-600" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-3">Cosa stai cercando?</h2>
            <p className="text-gray-400">
              Usa la barra di ricerca in alto per trovare film e serie TV.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
