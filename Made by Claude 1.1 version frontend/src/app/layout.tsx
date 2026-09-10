import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const fraunces = localFont({
  src: "../../brand-kit/fonts/Fraunces-Variable.ttf",
  variable: "--font-display",
  display: "swap",
  weight: "100 900",
});
const inter = localFont({
  src: "../../brand-kit/fonts/Inter-Variable.ttf",
  variable: "--font-body",
  display: "swap",
  weight: "100 900",
});
const mono = localFont({
  src: [
    { path: "../../brand-kit/fonts/IBMPlexMono-Regular.ttf", weight: "400" },
    { path: "../../brand-kit/fonts/IBMPlexMono-Medium.ttf", weight: "500" },
  ],
  variable: "--font-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Placedon — the record for Indian corporate law",
    template: "%s | Placedon",
  },
  description:
    "Placedon answers Indian corporate-law questions with the exact provision, the amending instrument, and the operative date — and abstains when it cannot verify.",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      data-theme="dark"
      className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
