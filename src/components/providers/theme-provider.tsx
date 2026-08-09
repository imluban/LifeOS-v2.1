"use client";

import { useEffect } from "react";
import { usePreferencesStore } from "@/store/preferences-store";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrate = usePreferencesStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
