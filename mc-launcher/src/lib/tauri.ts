import { invoke as tauriInvoke } from '@tauri-apps/api/core';
import { listen as tauriListen } from '@tauri-apps/api/event';
import type {
  DeviceCodeInfo,
  Instance,
  InstanceSettings,
  ProgressPayload,
  Session
} from '../types';

export const invoke = tauriInvoke;
export const listen = tauriListen;

export const api = {
  getSession: () => invoke<Session | null>('get_session'),
  authStartDeviceCode: () => invoke<DeviceCodeInfo>('auth_start_device_code'),
  authPoll: () => invoke<Session>('auth_poll'),
  logout: () => invoke<void>('logout'),
  instancesList: () => invoke<Instance[]>('instances_list'),
  instanceGet: (id: string) => invoke<Instance>('instance_get', { id }),
  instanceSaveSettings: (id: string, settings: InstanceSettings) =>
    invoke<void>('instance_save_settings', { id, settings }),
  launchPrepare: (instanceId: string) => invoke<void>('launch_prepare', { instanceId }),
  onProgress: (handler: (payload: ProgressPayload) => void) =>
    listen<ProgressPayload>('mc:progress', (event) => handler(event.payload))
};
