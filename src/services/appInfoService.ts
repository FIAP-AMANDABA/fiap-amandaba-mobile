import Constants from 'expo-constants';

export interface AppInfo {
  name: string;
  version: string;
  commitHash: string;
  commitShort: string;
}

interface BuildExtra {
  commitHash?: string;
}

export function getAppInfo(): AppInfo {
  const config = Constants.expoConfig;
  const extra = (config?.extra ?? {}) as BuildExtra;
  const commitHash = extra.commitHash ?? 'indisponível';

  return {
    name: config?.name ?? 'AmandaBa',
    version: config?.version ?? '—',
    commitHash,
    commitShort: commitHash.slice(0, 7),
  };
}
