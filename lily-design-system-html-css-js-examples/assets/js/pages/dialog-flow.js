// The page script of dialog-flow.html, in a file so a strict Content Security Policy needs no 'unsafe-inline'.
(function () {
    "use strict";

    var confirmDialog = document.getElementById("confirm-dialog");
    var alertDialog = document.getElementById("alert-dialog");
    var drawer = document.getElementById("help-drawer");
    var deleteBtn = document.getElementById("delete-btn");

    // Tooltip hover behavior
    var tooltipWrapper = document.querySelector(".tooltip-wrapper");
    var tooltip = document.getElementById("delete-tooltip");
    if (tooltipWrapper && tooltip) {
        tooltipWrapper.addEventListener("mouseenter", function () {
            tooltip.setAttribute("aria-hidden", "false");
        });
        tooltipWrapper.addEventListener("mouseleave", function () {
            tooltip.setAttribute("aria-hidden", "true");
        });
        tooltipWrapper.addEventListener("focusin", function () {
            tooltip.setAttribute("aria-hidden", "false");
        });
        tooltipWrapper.addEventListener("focusout", function () {
            tooltip.setAttribute("aria-hidden", "true");
        });
    }

    // Confirm dialog
    deleteBtn.addEventListener("click", function () {
        confirmDialog.showModal();
    });
    document.getElementById("cancel-delete-btn").addEventListener("click", function () {
        confirmDialog.close();
    });
    document.getElementById("confirm-delete-btn").addEventListener("click", function () {
        confirmDialog.close();
        deleteBtn.disabled = true;
        document.getElementById("deleted-status").hidden = false;
    });

    // Alert dialog
    document.getElementById("alert-btn").addEventListener("click", function () {
        alertDialog.showModal();
    });
    document.getElementById("dismiss-alert-btn").addEventListener("click", function () {
        alertDialog.close();
    });

    // Drawer
    document.getElementById("drawer-btn").addEventListener("click", function () {
        drawer.setAttribute("data-open", "true");
    });
    document.getElementById("close-drawer-btn").addEventListener("click", function () {
        drawer.setAttribute("data-open", "false");
    });

    // Escape key for dialogs
    [confirmDialog, alertDialog].forEach(function (dialog) {
        dialog.addEventListener("keydown", function (e) {
            if (e.key === "Escape") dialog.close();
        });
    });
})();
