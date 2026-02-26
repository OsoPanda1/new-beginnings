import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAMV MD-X4 | Ecosistema Quantum Sensorial",
  description:
    "Experiencias inmersivas, economia etica, y conexiones autenticas en un ecosistema 4D quantum-sensorial. El Metaverso Social del Futuro.",
};

export const viewport: Viewport = {
  themeColor: "#001a4d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
