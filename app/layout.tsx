import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.coreselva.com"),
  title: { default: "CoreSelva - Open RISC-V hardware and engineering education", template: "%s | CoreSelva" },
  description: "Open educational RISC-V hardware and rigorous embedded-systems learning for builders who want to understand every layer.",
  openGraph: {
    title: "CoreSelva",
    description: "Readable RISC-V processor cores, reusable SoC IP, and engineering education from C code to hardware.",
    url: "https://www.coreselva.com",
    siteName: "CoreSelva",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Navbar/><main>{children}</main><Footer/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "CoreSelva", founder: [{ "@type": "Person", name: "Karan Arjun Selvan", sameAs: "https://www.linkedin.com/in/karanarjuns/" }, { "@type": "Person", name: "Vishal Selvan", sameAs: "https://www.linkedin.com/in/vishal-selvan-252328285/" }], url: "https://www.coreselva.com", logo: "https://www.coreselva.com/logo.png" }) }}/></body></html>;
}
