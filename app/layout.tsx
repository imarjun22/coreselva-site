import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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
      <head>
        {/* Google Organization Logo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "CoreSelva",
              url: "https://coreselva.com",
              logo: "https://coreselva.com/logo.png",
            }),
          }}
        />
      </head>

      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}