"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useThemeLogo() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client render, default to light theme
  if (!mounted) {
    return "/QvaEventsIcon.svg";
  }

  const currentTheme = theme === "system" ? systemTheme : theme;
  return currentTheme === "dark" ? "/QvaEventsIconFilledWhite.svg" : "/QvaEventsIcon.svg";
}
