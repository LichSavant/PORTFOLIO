import type { Metadata } from "next";
import "@fontsource/ibm-plex-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dhanwil Alcover",
  description: "Portfolio of Dhanwil Alcover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
