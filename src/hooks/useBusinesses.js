import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

export function useBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const generation = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++generation.current;
    try {
      const data = await api('/businesses');
      if (request === generation.current) { setBusinesses(data.businesses); setError(''); }
      return data.businesses;
    } catch (e) {
      if (request === generation.current) setError(e.message);
      throw e;
    } finally { if (request === generation.current) setLoading(false); }
  }, []);
  useEffect(() => {
    refresh().catch(() => {});
    const request = generation.current;
    return () => { generation.current = request + 1; };
  }, [refresh]);
  return { businesses, loading, error, refresh };
}
