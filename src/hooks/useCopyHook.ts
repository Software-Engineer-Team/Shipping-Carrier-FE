import { useState } from 'react';

export function useCopyToClipboard() {
  const [result, setResult] = useState<null | { state: 'success' } | { state: 'error'; message: string }>(null);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setResult({ state: 'success' });
    } catch (e: any) {
      setResult({ message: e.message, state: 'error' });
      throw e;
    } finally {
      setTimeout(() => {
        setResult(null);
      }, 2000);
    }
  };

  return [copy, result] as const;
}
