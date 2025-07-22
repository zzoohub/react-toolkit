"use server";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { ReadonlyRequestCookies, Theme } from "./type";

export async function ServerThemeWrapper({
  cookies,
  children,
}: {
  cookies: () => Promise<ReadonlyRequestCookies>;
  children: React.ReactNode;
}) {
  if (typeof window !== "undefined") {
    return <ThemeProvider>{children}</ThemeProvider>;
  }

  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;
  return <ThemeProvider theme={theme as Theme}>{children}</ThemeProvider>;
}
