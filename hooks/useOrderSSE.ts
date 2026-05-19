'use client';

import { useEffect, useState } from 'react';
import { OrderStatus } from '@/types';

export function useOrderSSE(orderId: string | null, token?: string | null) {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [connected, setConnected] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!orderId || !token) return;

    const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status-stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    es.onopen = () => setConnected(true);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const incoming = data.status as OrderStatus;
        setStatus(incoming);
        if (incoming === 'DELIVERED') {
          setDone(true);
          setConnected(false);
          es.close();
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
    };

    return () => {
      es.close();
      setConnected(false);
    };
  }, [orderId, token]);

  return { status, connected, done };
}
