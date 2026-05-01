import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ThemeScript from "@/components/ThemeScript";
import CommandPalette from "@/components/CommandPalette";
import OfflineSync from "@/components/OfflineSync";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Collaborative Team Hub",
  description: "A real-time collaborative workspace for modern teams",
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Team Hub",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <OfflineSync />
            {children}
            <CommandPalette />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
