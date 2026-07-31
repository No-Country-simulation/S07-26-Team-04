import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Índice de Capacidad Varada — PhysaFlow",
  description: "Una taxonomía nominal de infraestructura pagada, energizada y no productiva en las tres capas físicas del centro de datos moderno: instalaciones, TI y carga de trabajo.",
  openGraph: {
    title: "Índice de Capacidad Varada — PhysaFlow",
    description: "Una taxonomía nominal de infraestructura pagada, energizada y no productiva en las tres capas físicas del centro de datos moderno.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col paper-texture">
        {children}
      </body>
    </html>
  );
}
