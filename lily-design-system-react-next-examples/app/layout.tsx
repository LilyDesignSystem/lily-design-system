import type { Metadata } from "next";
import "@/assets/css/nhs.css";

export const metadata: Metadata = {
  title: "Lily Design System — React Next Examples",
  description:
    "React Next.js examples of the Lily Design System using NHS UK styles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="site-footer">
          <p>Lily™ and Lily Design System™ are trademarks.</p>
        </footer>
      </body>
    </html>
  );
}
