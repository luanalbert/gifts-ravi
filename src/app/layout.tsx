import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cantinho do Ravi 💛",
  description:
    "Lista de presentes do Ravi — contribua com o que desejar.",
  openGraph: {
    title: "Cantinho do Ravi 💛",
    description: "O Ravi está chegando! Veja a lista de presentes.",
    type: "website",
  },
  themeColor: "#FAFAF7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
