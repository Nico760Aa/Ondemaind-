import { useEffect } from "react";
import { BookmarkCheck, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import ContentCard from "../components/ContentCard";

export default function MyListPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { myList, toggleMyList } = useApp();

  return (
    <div className="bg-gray-950 min-h-screen pt-24 pb-16">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BookmarkCheck size={28} className="text-red-500" />
            <h1 className="text-3xl md:text-4xl font-black text-white">La Mia Lista</h1>
            <span className="bg-gray-800 text-gray-400 text-sm px-3 py-1 rounded-full">
              {myList.length} titoli
            </span>
          </div>
          {myList.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Svuotare tutta la lista?")) {
                  myList.forEach((item) => toggleMyList(item));
                }
              }}
              className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm"
            >
              <Trash2 size={16} />
              <span className="hidden sm:block">Svuota lista</span>
            </button>
          )}
        </div>

        {myList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {myList.map((item) => (
              <ContentCard key={item.id} item={item} size="normal" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-6">
              <BookmarkCheck size={40} className="text-gray-600" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-3">La tua lista è vuota</h2>
            <p className="text-gray-400 text-base max-w-sm leading-relaxed">
              Aggiungi film e serie TV alla tua lista cliccando il pulsante{" "}
              <span className="text-white font-semibold">+</span> su qualsiasi titolo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
