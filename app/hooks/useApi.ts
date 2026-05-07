/**
 * useApi — Generic hook for data fetching via the API client.
 * Handles loading, error and success states.
 */
import { useCallback, useEffect, useRef, useState } from "react";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): ApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetch = useCallback(fetcher, deps);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetch();
      if (mountedRef.current) setData(result);
    } catch (err: unknown) {
      if (mountedRef.current) {
        const msg =
          err instanceof Error
            ? err.message
            : "Could not connect to server. Make sure the backend is running.";
        setError(msg);
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [fetch]);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  return { data, loading, error, refetch: load };
}
