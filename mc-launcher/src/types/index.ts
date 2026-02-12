export interface Session {
  username: string;
  uuid: string;
  accessToken: string;
}

export interface DeviceCodeInfo {
  userCode: string;
  verificationUri: string;
  verificationUriComplete: string;
  expiresIn: number;
  interval: number;
  message: string;
}

export interface Resolution {
  width: number;
  height: number;
}

export interface InstanceSettings {
  ramMinMb: number;
  ramMaxMb: number;
  javaPath: string;
  jvmArgs: string;
  resolution: Resolution;
}

export interface Instance {
  id: string;
  name: string;
  settings: InstanceSettings;
}

export interface ProgressPayload {
  stage: 'libraries' | 'assets' | 'mods' | 'extract' | 'launch';
  downloaded: number;
  total: number;
  currentFile: string;
}
