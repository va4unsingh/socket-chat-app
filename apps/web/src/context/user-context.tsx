
"use client";

import { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
  username: string;
  avatar: string | null;
  setUsername: (username: string) => void;
  setAvatar: (avatar: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState('ancient elegy');
  const [avatar, setAvatar] = useState<string | null>('https://picsum.photos/200');

  return (
    <UserContext.Provider value={{ username, avatar, setUsername, setAvatar }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
