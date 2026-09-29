import { useState, useCallback } from 'react';
import { fetchMolecule } from '../services/api';

/**
 * Custom hook for managing molecule search state.
 */
export function useMolecule() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('chemviz_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const search = useCallback(async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchMolecule(trimmed);
      setData(result);

      // Update search history
      setHistory((prev) => {
        const filtered = prev.filter(
          (item) => item.toLowerCase() !== trimmed.toLowerCase()
        );
        const updated = [trimmed, ...filtered].slice(0, 10);
        localStorage.setItem('chemviz_history', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('chemviz_history');
  }, []);

  return { data, loading, error, history, search, clearHistory };
}
