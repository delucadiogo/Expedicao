import React, { createContext, useContext, useEffect } from 'react';
import { useExpedition } from '@/hooks/use-expedition';

const ExpeditionContext = createContext<ReturnType<typeof useExpedition> | null>(null);

export function ExpeditionProvider({ children }: { children: React.ReactNode }) {
  const expedition = useExpedition();

  // Carregar dados iniciais
  useEffect(() => {
    expedition.loadExpeditions();
    expedition.loadStats();
  }, []);

  return (
    <ExpeditionContext.Provider value={expedition}>
      {children}
    </ExpeditionContext.Provider>
  );
}

export function useExpeditionContext() {
  const context = useContext(ExpeditionContext);
  if (!context) {
    throw new Error('useExpeditionContext deve ser usado dentro de um ExpeditionProvider');
  }
  return context;
}
