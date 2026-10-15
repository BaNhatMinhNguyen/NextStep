import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextStep | Tulane Student Guide",
  description: "Your next step before and after arriving at Tulane. An independent student checklist.",
  robots: { index: false, follow: false },
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
