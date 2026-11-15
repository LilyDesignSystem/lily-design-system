// The page script of rating-and-feedback.html, in a file so a strict Content Security Policy needs no 'unsafe-inline'.
(function () {
    "use strict";

    // The ratings are native radios: the browser owns selection and keys.
    document.getElementById("feedback-form").addEventListener("submit", function (e) {
        e.preventDefault();
        var checked = document.querySelector('input[name="stars"]:checked');
        var selectedStar = checked ? parseInt(checked.value, 10) : 0;

        // Show success section with rating view
        var ratingView = document.getElementById("rating-view");
        ratingView.textContent = "";
        ratingView.setAttribute("aria-label", "Your rating: " + selectedStar + " of 5 stars");
        for (var i = 1; i <= 5; i++) {
            var span = document.createElement("span");
            span.textContent = i <= selectedStar ? "\u2605" : "\u2606";
            ratingView.appendChild(span);
        }

        document.getElementById("form-section").hidden = true;
        document.getElementById("success-section").hidden = false;
    });
})();
