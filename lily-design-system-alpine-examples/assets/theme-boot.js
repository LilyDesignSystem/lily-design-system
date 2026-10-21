// Creates the theme <link> before first paint (the stored slug if any, else the default) and sets data-theme.
// A classic, parser-blocking script in each page's <head>, so nothing paints unthemed.
(function () {
  var slug = "united-kingdom-national-health-service-england-for-patients";
  try {
    var stored = localStorage.getItem("lily-theme");
    if (stored && /^[a-z0-9-]+$/.test(stored)) slug = stored;
  } catch (e) {}
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.id = "lily-theme-link";
  link.href = "/themes/" + slug + ".css";
  document.head.appendChild(link);
  document.documentElement.setAttribute("data-theme", slug);
})();
