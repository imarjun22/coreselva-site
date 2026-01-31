import "./globals.css";

export const metadata = {
  title: "CoreSelva",
  description: "Educational Hardware IP Design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}