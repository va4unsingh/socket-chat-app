"use client";

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { initializeUser } from './slices/userSlice';

export function StoreProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(initializeUser());
    }, []);

  return <Provider store={store}>{children}</Provider>;
}
