// Components page interactivity: render the catalog and filter by query.
(function () {
  "use strict";

  const list = document.getElementById("component-list");
  const search = document.getElementById("component-search");
  const countLine = document.getElementById("component-count");

  if (!list || !window.LILY_COMPONENTS) return;

  const total = window.LILY_COMPONENTS.length;

  function render(items) {
    list.innerHTML = "";
    const fragment = document.createDocumentFragment();
    items.forEach(function (c) {
      const li = document.createElement("li");
      li.className = "component-list-item";
      const name = document.createElement("span");
      name.className = "component-list-item-name";
      name.textContent = c.name;
      const desc = document.createElement("span");
      desc.className = "component-list-item-description";
      desc.textContent = c.description;
      li.appendChild(name);
      li.appendChild(desc);
      fragment.appendChild(li);
    });
    list.appendChild(fragment);
  }

  function updateCount(visible) {
    if (!countLine) return;
    if (visible === total) {
      countLine.textContent = "Showing all components.";
    } else {
      countLine.textContent = "Showing " + visible + " components.";
    }
  }

  function filter(query) {
    const q = (query || "").trim().toLowerCase();
    if (!q) {
      render(window.LILY_COMPONENTS);
      updateCount(total);
      return;
    }
    const matches = window.LILY_COMPONENTS.filter(function (c) {
      return c.name.includes(q) ||
        c.pascal.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
    });
    render(matches);
    updateCount(matches.length);
  }

  // Initial render
  render(window.LILY_COMPONENTS);
  updateCount(total);

  // Wire up search
  if (search) {
    search.addEventListener("input", function (e) {
      filter(e.target.value);
    });
  }
})();
