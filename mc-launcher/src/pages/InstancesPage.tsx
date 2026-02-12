import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/tauri';
import type { Instance } from '../types';

export function InstancesPage() {
  const [instances, setInstances] = useState<Instance[]>([]);

  useEffect(() => {
    api.instancesList().then(setInstances);
  }, []);

  return (
    <section>
      <h1>Instances</h1>
      <ul>
        {instances.map((instance) => (
          <li key={instance.id}>
            {instance.name} <Link to={`/instance/${instance.id}`}>Entrar</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
