// Creates the managed theme <link> before first paint (persisted slug if
// any, else the default) and sets data-theme. Loaded as a classic,
// parser-blocking script in each page's <head>, so nothing paints
// unthemed; the <theme-picker> element adopts the link once defined.
(function () {
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
})();
