import { useEffect } from "react";
import Hero from "../components/Hero";
import ContentRow from "../components/ContentRow";
import { useApp } from "../context/AppContext";
import {
  getFeatured,
  getTrending,
  getNewReleases,
  getMovies,
  getSeries,
} from "../data/catalog";

const featured = getFeatured();
const trending = getTrending();
const newReleases = getNewReleases();
const movies = getMovies();
const series = getSeries();

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { continueWatching } = useApp();

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Hero */}
      <Hero items={featured} />

      {/* Content Rows */}
      <div className="mt-4 pb-16">
        {continueWatching.length > 0 && (
          <ContentRow
            title="Continua a guardare"
            items={continueWatching}
            badge="I tuoi"
          />
        )}
        <ContentRow title="🔥 In Tendenza" items={trending} badge="Oggi" />
        <ContentRow title="🆕 Nuove Uscite" items={newReleases} />
        <ContentRow title="🎬 Film Consigliati" items={movies} />
        <ContentRow title="📺 Serie TV Popolari" items={series} />
        <ContentRow
          title="⭐ Meglio Valutati"
          items={[...trending, ...newReleases]
            .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
            .filter((item, index, self) => self.findIndex(i => i.id === item.id) === index)
            .slice(0, 8)}
        />
      </div>
    </div>
  );
}
