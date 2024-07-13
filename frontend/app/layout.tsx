import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";

import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";


import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import MobileOnlyApp from "@/components/mobileOnly";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  initialScale: 1,
  minimumScale: 1,
  width: "device-width",
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <div
          className="fixed top-0 left-0 w-full h-full z-20 pointer-events-none"
          id="apeBackground"
        />
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <MobileOnlyApp>
            <Navbar />
            <main className="w-full h-full">{children}</main>
          </MobileOnlyApp>
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
