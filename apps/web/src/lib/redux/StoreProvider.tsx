"use client";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";
import { checkUserSession, login } from "./slices/userSlice";

export function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      storeRef.current?.dispatch(login(JSON.parse(user)));
    } else {
      storeRef.current?.dispatch(checkUserSession() as any);
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
