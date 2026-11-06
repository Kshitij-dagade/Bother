import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOTHER — You're not the only one.",
  description:
    "A new kind of social network. Everyone has something they're trying to figure out. BOTHER helps you find people who've been through it, share experiences, and discover what actually helped.",
  icons: {
    icon: "/app-icon.png",
    shortcut: "/app-icon.png",
    apple: "/app-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-warm-ivory font-body-md text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
