import { FormEvent, useEffect, useState } from 'react';
import { api } from '../lib/tauri';
import type { Instance, InstanceSettings } from '../types';

export function SettingsPage() {
  const [instance, setInstance] = useState<Instance | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.instanceGet('alpha').then(setInstance);
  }, []);

  if (!instance) return <p>Cargando...</p>;

  const onSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(false);
    await api.instanceSaveSettings(instance.id, instance.settings);
    setSaved(true);
  };

  const patchSettings = (patch: Partial<InstanceSettings>) => {
    setInstance((prev) =>
      prev
        ? {
            ...prev,
            settings: {
              ...prev.settings,
              ...patch,
              resolution: {
                ...prev.settings.resolution,
                ...(patch.resolution ?? {})
              }
            }
          }
        : prev
    );
  };

  return (
    <section>
      <h1>Settings</h1>
      <form onSubmit={onSave} style={{ display: 'grid', maxWidth: 420, gap: 10 }}>
        <label>
          RAM Min (MB)
          <input
            type="number"
            value={instance.settings.ramMinMb}
            onChange={(e) => patchSettings({ ramMinMb: Number(e.target.value) })}
          />
        </label>
        <label>
          RAM Max (MB)
          <input
            type="number"
            value={instance.settings.ramMaxMb}
            onChange={(e) => patchSettings({ ramMaxMb: Number(e.target.value) })}
          />
        </label>
        <label>
          Java Path
          <input value={instance.settings.javaPath} onChange={(e) => patchSettings({ javaPath: e.target.value })} />
        </label>
        <label>
          JVM Args
          <input value={instance.settings.jvmArgs} onChange={(e) => patchSettings({ jvmArgs: e.target.value })} />
        </label>
        <label>
          Resolution Width
          <input
            type="number"
            value={instance.settings.resolution.width}
            onChange={(e) => patchSettings({ resolution: { ...instance.settings.resolution, width: Number(e.target.value) } })}
          />
        </label>
        <label>
          Resolution Height
          <input
            type="number"
            value={instance.settings.resolution.height}
            onChange={(e) => patchSettings({ resolution: { ...instance.settings.resolution, height: Number(e.target.value) } })}
          />
        </label>
        <button type="submit">Guardar</button>
        {saved && <small>Guardado correctamente.</small>}
      </form>
    </section>
  );
}
