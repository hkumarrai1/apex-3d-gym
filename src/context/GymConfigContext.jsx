import React, { createContext, useContext, useState, useEffect } from 'react';
import { GYM_CONFIG as DEFAULT_CONFIG } from '../config/gymConfig';

const GymConfigContext = createContext({
  config: DEFAULT_CONFIG,
  updateConfig: async () => {},
  resetConfig: async () => {},
  loading: false,
});

export function GymConfigProvider({ children }) {
  const [config, setConfig] = useState(() => {
    try {
      const cached = localStorage.getItem('gym_active_config');
      return cached ? JSON.parse(cached) : DEFAULT_CONFIG;
    } catch (e) {
      return DEFAULT_CONFIG;
    }
  });

  const [loading, setLoading] = useState(false);

  // Fetch live configuration from server on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveConfig() {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          if (data?.config && isMounted) {
            setConfig(data.config);
            try {
              localStorage.setItem('gym_active_config', JSON.stringify(data.config));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('Could not fetch live config from backend, using current state:', err.message);
      }
    }
    fetchLiveConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateConfig = async (newConfig) => {
    setLoading(true);
    try {
      const merged = { ...config, ...newConfig };
      setConfig(merged);
      try {
        localStorage.setItem('gym_active_config', JSON.stringify(merged));
      } catch (e) {}

      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
          localStorage.setItem('gym_active_config', JSON.stringify(data.config));
        }
      }
      return { success: true };
    } catch (err) {
      console.error('Failed to update config on server:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const resetConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/config/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const cfg = data.config || DEFAULT_CONFIG;
        setConfig(cfg);
        localStorage.setItem('gym_active_config', JSON.stringify(cfg));
      }
      return { success: true };
    } catch (err) {
      console.error('Failed to reset config:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <GymConfigContext.Provider value={{ config, updateConfig, resetConfig, loading }}>
      {children}
    </GymConfigContext.Provider>
  );
}

export function useGymConfig() {
  const context = useContext(GymConfigContext);
  if (!context) {
    throw new Error('useGymConfig must be used within a GymConfigProvider');
  }
  return context;
}
