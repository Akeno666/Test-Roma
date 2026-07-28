import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ромометр — проверка настоящего Ромы",
  description:
    "Семь контрольных вопросов. Пройди сверхсекретную проверку личности.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
