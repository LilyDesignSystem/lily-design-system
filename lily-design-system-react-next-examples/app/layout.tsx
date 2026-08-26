import type { Metadata } from "next";
import "@/assets/css/app-shell.css";
import { SiteHeader } from "./site-header";
import SkipLink from "@/components/SkipLink";

export const metadata: Metadata = {
  title: "Lily Design System — React Next Examples",
  description:
    "React Next.js examples of the Lily Design System using NHS UK styles",
};

// Creates the managed theme <link> before first paint (persisted slug if
// any, else the default) and sets data-theme. The link is created by this
// script — NOT rendered through JSX — so React hydration never owns it and
// the theme-picker helper can adopt it cleanly on mount. Parser-blocking,
// so nothing paints unthemed.
const prePaint = `(function () {
  var slug = "united-kingdom-national-health-service-england-for-patients";
  try {
    var stored = localStorage.getItem("lily-theme");
    if (stored && /^[a-z0-9-]+$/.test(stored)) slug = stored;
  } catch (e) {}
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.setAttribute("data-lily-theme-picker", "theme");
  link.href = "/themes/" + slug + ".css";
  document.head.appendChild(link);
  document.documentElement.setAttribute("data-theme", slug);
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaint }} />
      </head>
      <body>
        <SkipLink href="#content" label="Skip to main content" />
        <SiteHeader />
        <div id="content">{children}</div>
        <footer className="site-footer">
          <p>Lily™ and Lily Design System™ are trademarks.</p>
        </footer>
      </body>
    </html>
  );
}
