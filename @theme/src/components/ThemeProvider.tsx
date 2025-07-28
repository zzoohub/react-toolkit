import { ReadonlyRequestCookies } from "../types";
import { ClientThemeProvider } from "./ClientThemeProvider";
import { ServerThemeProvider } from "./ServerThemeProvider";

export function ThemeProvider({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies?: () => Promise<ReadonlyRequestCookies>;
}) {
  if (typeof window === "undefined") {
    if (!cookies) {
      throw new Error("cookies is required");
    }
    return (
      <ServerThemeProvider cookies={cookies}>{children}</ServerThemeProvider>
    );
  }

  return <ClientThemeProvider>{children}</ClientThemeProvider>;
}
