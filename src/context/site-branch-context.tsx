
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { salonApi } from '@/lib/api-client';

type Site = {
  id: string;
  name: string;
  code?: string | null;
};

type SiteContextType = {
  sites: Site[];
  selectedSiteId: string | null;
  setSelectedSiteId: (siteId: string | null) => void;
  loading: boolean;
  error: string | null;
  refreshSites: () => Promise<void>;
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSites = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await salonApi.post<any>('/Site/GetAll', {});
      const sitesData = (response.data ?? response) as any[];

      const mappedSites: Site[] = sitesData.map((s: any) => ({
        id: s.id,
        name: s.name,
        code: s.code,
      }));

      setSites(mappedSites);

      // Auto-select first site if none selected
      if (!selectedSiteId && mappedSites.length > 0) {
        setSelectedSiteId(mappedSites[0].id);
      }
    } catch (err) {
      console.error('Failed to load sites:', err);
      setError('Không thể tải danh sách chi nhánh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  return (
    <SiteContext.Provider
      value={{
        sites,
        selectedSiteId,
        setSelectedSiteId,
        loading,
        error,
        refreshSites: loadSites,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
