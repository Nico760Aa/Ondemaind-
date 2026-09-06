import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, User, X, Menu, Tv } from "lucide-react";
import { useApp } from "../context/AppContext";
import { searchCatalog } from "../data/catalog";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length > 0) navigate("/search?q=" + encodeURIComponent(val));
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Film", path: "/movies" },
    { label: "Serie TV", path: "/series" },
    { label: "La Mia Lista", path: "/mylist" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gray-950/95 backdrop-blur-md shadow-2xl"
          : "bg-gradient-to-b from-gray-950/90 to-transparent"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-red-600 rounded-lg p-1.5">
              <Tv className="text-white" size={22} />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight">
              <span className="text-red-500">Stream</span>
              <span className="text-white">Flix</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-white ${
                  location.pathname === link.path
                    ? "text-white"
                    : "text-gray-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Bar */}
            <div className="flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center bg-gray-900 border border-gray-600 rounded-full px-3 py-1.5 gap-2">
                  <Search size={16} className="text-gray-400 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Titoli, generi..."
                    className="bg-transparent text-white text-sm outline-none w-36 md:w-48 placeholder-gray-500"
                  />
                  <button onClick={handleSearchToggle}>
                    <X size={16} className="text-gray-400 hover:text-white" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSearchToggle}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            <button className="p-2 text-gray-300 hover:text-white transition-colors relative hidden md:block">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="hidden md:block text-sm text-gray-300 group-hover:text-white transition-colors">
                Utente
              </span>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="md:hidden bg-gray-950/98 border-t border-gray-800 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenu(false)}
                className={`block px-4 py-3 text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-white bg-gray-800/50"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
