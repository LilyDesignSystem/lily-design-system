// The page script of rating-and-feedback.html, in a file so a strict Content Security Policy needs no 'unsafe-inline'.
(function () {
    "use strict";

    // Radio group picker behavior
    function setupPicker(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;
        var buttons = container.querySelectorAll('[role="radio"]');
        buttons.forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                buttons.forEach(function (b) {
                    b.setAttribute("aria-checked", "false");
                });
                btn.setAttribute("aria-checked", "true");
            });
        });
    }

    setupPicker("star-picker");
    setupPicker("face-picker");
    setupPicker("nps-picker");

    // Form submission
    document.getElementById("feedback-form").addEventListener("submit", function (e) {
        e.preventDefault();
        var starButtons = document.querySelectorAll('#star-picker [role="radio"]');
        var selectedStar = 0;
        starButtons.forEach(function (b) {
            if (b.getAttribute("aria-checked") === "true") {
                selectedStar = parseInt(b.getAttribute("data-value"), 10);
            }
        });

        // Show success section with rating view
        var ratingView = document.getElementById("rating-view");
        ratingView.innerHTML = "";
        for (var i = 1; i <= 5; i++) {
            var span = document.createElement("span");
            span.textContent = i <= selectedStar ? "\u2605" : "\u2606";
            ratingView.appendChild(span);
        }

        document.getElementById("form-section").hidden = true;
        document.getElementById("success-section").hidden = false;
    });
})();
