import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export function useSettings() {
  const settings = useSettingsStore((state) => state.settings);
  const status = useSettingsStore((state) => state.status);
  const load = useSettingsStore((state) => state.load);

  useEffect(() => {
    load();
  }, [load]);

  return { settings, status };
}
