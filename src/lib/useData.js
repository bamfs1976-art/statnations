import { useState, useEffect, useRef } from 'react';

const cache = new Map();

/**
 * Fetch JSON from /data/<file> with in-memory caching.
 * Returns { data, loading, error }
 */
export function useData(file) {
  const [state, setState] = useState({
    data: cache.get(file) ?? null,
    loading: !cache.has(file),
    error: null,
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (cache.has(file)) {
      setState({ data: cache.get(file), loading: false, error: null });
      return;
    }
    setState(s => ({ ...s, loading: true, error: null }));
    fetch(`/data/${file}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status} loading ${file}`);
        return r.json();
      })
      .then(data => {
        cache.set(file, data);
        if (mounted.current) setState({ data, loading: false, error: null });
      })
      .catch(err => {
        if (mounted.current) setState({ data: null, loading: false, error: err.message });
      });
    return () => { mounted.current = false; };
  }, [file]);

  return state;
}

/**
 * Fetch multiple JSON files in parallel.
 * Returns { data: { [key]: [...] }, loading, error }
 */
export function useMultiData(fileMap) {
  // fileMap: { key: 'filename.json', ... }
  const keys = Object.keys(fileMap);
  const files = keys.map(k => fileMap[k]);

  const allCached = files.every(f => cache.has(f));
  const [state, setState] = useState(() => ({
    data: allCached ? Object.fromEntries(keys.map(k => [k, cache.get(fileMap[k])])) : null,
    loading: !allCached,
    error: null,
  }));

  useEffect(() => {
    let mounted = true;
    if (files.every(f => cache.has(f))) {
      setState({
        data: Object.fromEntries(keys.map(k => [k, cache.get(fileMap[k])])),
        loading: false,
        error: null,
      });
      return;
    }
    setState(s => ({ ...s, loading: true, error: null }));
    Promise.all(
      files.map(f =>
        cache.has(f)
          ? Promise.resolve(cache.get(f))
          : fetch(`/data/${f}`)
              .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status} loading ${f}`); return r.json(); })
              .then(d => { cache.set(f, d); return d; })
      )
    )
      .then(results => {
        if (!mounted) return;
        const data = Object.fromEntries(keys.map((k, i) => [k, results[i]]));
        setState({ data, loading: false, error: null });
      })
      .catch(err => {
        if (mounted) setState({ data: null, loading: false, error: err.message });
      });
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(fileMap)]);

  return state;
}
