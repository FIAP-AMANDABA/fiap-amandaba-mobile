import { useMemo } from 'react';
import { getAppInfo } from '../services/appInfoService';

export function useAppInfo() {
  return useMemo(() => getAppInfo(), []);
}
