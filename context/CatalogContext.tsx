import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Catalog, bundledCatalog } from '@/data/catalog';
import { loadCatalog } from '@/services/catalog';

type CatalogValue = { catalog: Catalog; ready: boolean };

const Ctx = createContext<CatalogValue>({ catalog: bundledCatalog, ready: false });

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog>(bundledCatalog);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let live = true;
    loadCatalog()
      .then((c) => {
        if (live) setCatalog(c);
      })
      .finally(() => {
        if (live) setReady(true);
      });
    return () => {
      live = false;
    };
  }, []);

  return <Ctx.Provider value={{ catalog, ready }}>{children}</Ctx.Provider>;
}

export function useCatalog() {
  return useContext(Ctx);
}
