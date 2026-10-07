import { autoInit } from "@lilydesignsystem/nunjucks-link-picker";

// `navigate` turns a plain left click into client-side routing; Ctrl/Cmd-click, middle click and
// target="_blank" links stay native. Omit it for ordinary page loads.
autoInit({
  navigate: (href) => window.router.navigate(href),
  onNavigate: (id, href) => console.log("chosen", id, href),
});
