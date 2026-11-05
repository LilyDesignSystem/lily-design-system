// The page script of tabbed-interface.html, in a file so a strict Content Security Policy needs no 'unsafe-inline'.
(function () {
    "use strict";

    // Tab switching
    var tabs = document.querySelectorAll('[role="tab"]');
    var panels = document.querySelectorAll('[role="tabpanel"]');

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            tabs.forEach(function (t) {
                t.setAttribute("aria-selected", "false");
                t.setAttribute("tabindex", "-1");
            });
            tab.setAttribute("aria-selected", "true");
            tab.setAttribute("tabindex", "0");

            panels.forEach(function (p) {
                p.hidden = true;
            });
            var panelId = tab.getAttribute("aria-controls");
            var panel = document.getElementById(panelId);
            if (panel) panel.hidden = false;
        });
    });

    // Tab keyboard navigation
    var tabBar = document.querySelector(".tab-bar");
    if (tabBar) {
        tabBar.addEventListener("keydown", function (e) {
            var index = Array.from(tabs).indexOf(document.activeElement);
            if (index < 0) return;
            if (e.key === "ArrowRight") {
                e.preventDefault();
                tabs[(index + 1) % tabs.length].focus();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                tabs[(index - 1 + tabs.length) % tabs.length].focus();
            }
        });
    }
})();
