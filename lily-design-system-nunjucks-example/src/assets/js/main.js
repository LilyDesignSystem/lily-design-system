// Progressive-enhancement bootstrapper.
// Walks the DOM for elements with data-module attributes and
// dynamically imports the matching behaviour module.

const modules = new Set();
for (const el of document.querySelectorAll("[data-module]")) {
  modules.add(el.dataset.module);
}

for (const name of modules) {
  import(`./modules/${name}.js`)
    .then((mod) => {
      if (typeof mod.init === "function") mod.init();
    })
    .catch(() => {
      // Intentionally quiet: missing modules are an opt-in signal,
      // not an error the user needs to see.
    });
}
