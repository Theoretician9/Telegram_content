// src/client/utils.ts
import { useState, useEffect } from 'react';

export function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function useAuth(opts: { required: boolean }) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  useEffect(() => {
    // здесь будет реальный запрос, пока просто переключаем сразу в authenticated
    setStatus('authenticated');
  }, []);
  return { status };
}

export function useToast() {
  return {
    toast: (opts: { title: string; description?: string; variant?: string }) => {
      console.log('TOAST:', opts.title, opts.description || '');
    },
  };
}
