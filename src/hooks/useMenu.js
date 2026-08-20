import { useEffect } from 'react';
import { useMenuStore } from '../store/menuStore';

export function useMenu() {
  const categories = useMenuStore((state) => state.categories);
  const dishes = useMenuStore((state) => state.dishes);
  const status = useMenuStore((state) => state.status);
  const error = useMenuStore((state) => state.error);
  const load = useMenuStore((state) => state.load);

  useEffect(() => {
    load();
  }, [load]);

  return { categories, dishes, status, error };
}
