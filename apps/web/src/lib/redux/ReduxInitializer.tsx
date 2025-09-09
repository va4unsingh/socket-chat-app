"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeUser } from "@/lib/redux/slices/userSlice";

export function ReduxInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  return <>{children}</>;
}
