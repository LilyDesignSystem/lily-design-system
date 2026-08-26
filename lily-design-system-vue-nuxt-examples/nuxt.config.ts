export default defineNuxtConfig({
  // Component styling comes from the runtime theme layer (the managed
  // <link> created by the pre-paint script below and owned by the
  // theme-picker helper after hydration); this bundle keeps only the
  // app-shell chrome.
  css: ["~/assets/css/app-shell.css"],
  compatibilityDate: "2025-01-01",
  app: {
    head: {
      title: "Lily Design System — Vue Nuxt Examples",
      script: [
        {
          // Creates the managed theme <link> before first paint
          // (persisted slug if any, else the default) and sets
          // data-theme. Created by script — not rendered — so
          // hydration never owns it and the helper adopts it cleanly.
          innerHTML: `(function () {
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
})();`,
        },
      ],
    },
  },
});
