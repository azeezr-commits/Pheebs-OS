import React, { createContext, useContext, useState } from 'react';
import { SessionManager } from './SessionManager';
import { LocalStorageAdapter } from '../storage/LocalStorageAdapter';

interface SessionContextType {
  manager: SessionManager;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manager] = useState(() => {
    const storageAdapter = new LocalStorageAdapter();
    return new SessionManager(storageAdapter);
  });

  return (
    <SessionContext.Provider value={{ manager }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionEngine = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionEngine must be used within a SessionProvider');
  }
  return context;
};
