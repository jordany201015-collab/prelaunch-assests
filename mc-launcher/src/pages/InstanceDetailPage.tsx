import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/tauri';
import type { Instance, ProgressPayload } from '../types';

export function InstanceDetailPage() {
  const { id = '' } = useParams();
  const [instance, setInstance] = useState<Instance | null>(null);
  const [progress, setProgress] = useState<ProgressPayload | null>(null);

  useEffect(() => {
    if (!id) return;
    api.instanceGet(id).then(setInstance);
  }, [id]);

  useEffect(() => {
    let unlisten: (() => void) | undefined;
    api.onProgress((payload) => {
      setProgress(payload);
    }).then((fn) => {
      unlisten = fn;
    });

    return () => {
      unlisten?.();
    };
  }, []);

  const pct = useMemo(() => {
    if (!progress || progress.total === 0) return 0;
    return Math.min(100, Math.round((progress.downloaded / progress.total) * 100));
  }, [progress]);

  return (
    <section>
      <h1>{instance?.name ?? 'Instancia'}</h1>
      <button onClick={() => api.launchPrepare(id)}>Play</button>
      <div style={{ marginTop: 16, maxWidth: 500 }}>
        <div style={{ height: 14, borderRadius: 999, background: '#d1d5db', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, background: '#10b981', height: '100%' }} />
        </div>
        {progress && (
          <small>
            {progress.stage} - {progress.currentFile} ({progress.downloaded}/{progress.total})
          </small>
        )}
      </div>
    </section>
  );
}
