// hooks/useSyncDatesFromURL.ts
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function useSyncDatesFromURL(
  setFrom: (d: Date) => void,
  setTo: (d: Date) => void
) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    if (fromDate && toDate) {
      setFrom(new Date(fromDate));
      setTo(new Date(toDate));
    }
  }, []);
}
