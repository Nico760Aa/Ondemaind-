import { createContext, useContext, useState, useEffect } from "react";
import { catalog } from "../data/catalog";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [myList, setMyList] = useState(() => {
    const saved = localStorage.getItem("streamflix_mylist");
    return saved ? JSON.parse(saved) : [];
  });
  const [continueWatching, setContinueWatching] = useState(() => {
    const saved = localStorage.getItem("streamflix_continue");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("streamflix_mylist", JSON.stringify(myList));
  }, [myList]);

  useEffect(() => {
    localStorage.setItem("streamflix_continue", JSON.stringify(continueWatching));
  }, [continueWatching]);

  const toggleMyList = (item) => {
    setMyList((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) return prev.filter((i) => i.id !== item.id);
      return [...prev, item];
    });
  };

  const isInMyList = (id) => myList.some((i) => i.id === id);

  const addToContinue = (item, progress = 0) => {
    setContinueWatching((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      return [{ ...item, progress }, ...filtered].slice(0, 10);
    });
  };

  return (
    <AppContext.Provider
      value={{
        myList,
        toggleMyList,
        isInMyList,
        continueWatching,
        addToContinue,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        catalog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
