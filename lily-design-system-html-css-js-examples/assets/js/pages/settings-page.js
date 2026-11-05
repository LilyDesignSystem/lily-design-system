// The page script of settings-page.html, in a file so a strict Content Security Policy needs no 'unsafe-inline'.
(function () {
    "use strict";

    document.querySelectorAll(".switch-button").forEach(function (el) {
        el.addEventListener("click", function () {
            var checked = el.getAttribute("aria-checked") === "true";
            el.setAttribute("aria-checked", String(!checked));
        });
    });

    document.getElementById("save-button").addEventListener("click", function () {
        var banner = document.getElementById("save-banner");
        banner.hidden = false;
        setTimeout(function () {
            banner.hidden = true;
        }, 3000);
    });
})();
