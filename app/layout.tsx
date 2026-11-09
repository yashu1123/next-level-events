import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Level Events | Make it unforgettable",
  description: "Live music, dance performances and unforgettable celebrations. Plan your next event with Next Level Events.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
