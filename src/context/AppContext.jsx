import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Global Search ─────────────────────────────────────────────────────────
  const [searchOpen, setSearchOpen] = useState(false);

  // ── Nation Comparison (max 5) ─────────────────────────────────────────────
  const [compareList, setCompareList] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const addToCompare = useCallback((nation) => {
    setCompareList(prev => {
      if (prev.find(n => n.id === nation.id)) return prev;
      if (prev.length >= 5) return prev;
      return [...prev, nation];
    });
  }, []);

  const removeFromCompare = useCallback((id) => {
    setCompareList(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    setCompareOpen(false);
  }, []);

  const isCompared = useCallback((id) => compareList.some(n => n.id === id), [compareList]);

  // ── Follow Your Nation (localStorage) ────────────────────────────────────
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sn-favorites') || '[]'); }
    catch { return []; }
  });

  const toggleFavorite = useCallback((nation) => {
    setFavorites(prev => {
      const next = prev.find(n => n.id === nation.id)
        ? prev.filter(n => n.id !== nation.id)
        : [...prev, { id: nation.id, name: nation.name, flag: nation.flag, module: nation.module }];
      localStorage.setItem('sn-favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.some(n => n.id === id), [favorites]);

  // ── Active module (lifted from App for share card context) ────────────────
  const [activeModule, setActiveModule] = useState('rugby');

  // ── Keyboard shortcut Cmd/Ctrl+K ─────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(o => !o);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setCompareOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <AppContext.Provider value={{
      searchOpen, setSearchOpen,
      compareList, addToCompare, removeFromCompare, clearCompare, isCompared,
      compareOpen, setCompareOpen,
      favorites, toggleFavorite, isFavorite,
      activeModule, setActiveModule,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
