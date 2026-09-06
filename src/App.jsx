import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MoviesPage from "./pages/MoviesPage";
import SeriesPage from "./pages/SeriesPage";
import MyListPage from "./pages/MyListPage";
import DetailPage from "./pages/DetailPage";
import VideoPlayer from "./components/VideoPlayer";
import SearchPage from "./pages/SearchPage";

function AppLayout() {
  const location = useLocation();
  const isWatching = location.pathname.startsWith("/watch");

  return (
    <div className="bg-gray-950">
      {!isWatching && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/mylist" element={<MyListPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/watch/:id" element={<VideoPlayer />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
