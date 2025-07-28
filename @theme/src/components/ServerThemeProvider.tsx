"use server";

import React from "react";
import { ClientThemeProvider } from "./ClientThemeProvider";
import type { ReadonlyRequestCookies, Theme } from "../types";

export async function ServerThemeProvider({
  cookies,
  children,
}: {
  cookies: () => Promise<ReadonlyRequestCookies>;
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value;
  return (
    <ClientThemeProvider theme={theme as Theme}>{children}</ClientThemeProvider>
  );
}
