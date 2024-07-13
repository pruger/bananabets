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
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
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
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {/* <MobileOnlyApp> */}
          <Navbar />
          <main className="w-full h-full">{children}</main>
              {/* <footer className="w-full flex items-center justify-center py-3">
                <Link
                  isExternal
                  className="flex items-center gap-1 text-current"
                  href="https://ethglobal.com/brussels"
                  title="ethglobal brussels page"
                >
                  <span className="text-default-600">Made for</span>
                  <p className="text-primary">ETHGlobal Brussels</p>
                </Link>
              </footer> */}
          {/* </MobileOnlyApp> */}
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
