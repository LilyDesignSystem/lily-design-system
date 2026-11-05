// The page script of book-an-appointment.html, in a file so a strict Content Security Policy needs no 'unsafe-inline'.
(function () {
    "use strict";

    // Book an appointment — Lily's flagship composed-page pattern,
    // ported to plain HTML + vanilla JS (plan P6-T3). Full write-up:
    // docs/patterns/book-an-appointment.md. Canonical reference:
    // lily-design-system-svelte-sveltekit-examples' /book-an-appointment.
    //
    // A single-page wizard: all six step panels live in this document
    // as <section data-step="N" hidden> blocks; this script toggles
    // `hidden`, validates each step's form, renders an error summary,
    // and moves focus -- reproducing by hand what a real route change
    // (or SvelteKit's navigation) gives other pages for free.

    var REASON_LABELS = {
        routine: "Routine check-up",
        "follow-up": "Follow-up appointment",
        vaccination: "Vaccination",
        other: "Something else",
    };

    var TIME_LABELS = {
        morning: "Morning (8am to 12pm)",
        afternoon: "Afternoon (12pm to 4pm)",
        evening: "Evening (4pm to 6pm)",
    };

    var errorSummaryEl = document.getElementById("booking-error-summary");
    var errorListEl = document.getElementById("booking-error-list");
    var stepListEl = document.getElementById("booking-step-list");

    var reasonForm = document.getElementById("reason-form");
    var dateTimeForm = document.getElementById("date-time-form");
    var detailsForm = document.getElementById("details-form");
    var confirmForm = document.getElementById("confirm-form");

    var reasonOtherBlock = document.getElementById("reason-other-block");
    var reasonOtherTextarea = document.getElementById("reason-other-detail");
    var characterCounterEl = document.getElementById("reason-other-counter");

    var appointmentDateInput = document.getElementById("appointment-date");

    // ---- Field readers (DOM is the source of truth; no shadow state) ----

    function getReason() {
        var checked = document.querySelector('input[name="reason"]:checked');
        return checked ? checked.value : "";
    }
    function getReasonOtherDetail() {
        return reasonOtherTextarea.value.trim();
    }
    function getAppointmentDate() {
        return appointmentDateInput.value;
    }
    function getAppointmentTime() {
        return document.getElementById("appointment-time").value;
    }
    function getFullName() {
        return document.getElementById("full-name").value.trim();
    }
    function getEmail() {
        return document.getElementById("email").value.trim();
    }
    function getPhone() {
        return document.getElementById("phone").value.trim();
    }
    function getNeedsSupport() {
        return document.getElementById("needs-support").checked;
    }
    function getConfirmedAccurate() {
        return document.getElementById("confirmed-accurate").checked;
    }

    function todayIso() {
        return new Date().toISOString().slice(0, 10);
    }
    appointmentDateInput.min = todayIso();

    // ---- Error summary / inline error-message plumbing ----

    function clearErrors() {
        errorListEl.innerHTML = "";
        errorSummaryEl.hidden = true;
        document.querySelectorAll(".error-message").forEach(function (el) {
            el.hidden = true;
            el.textContent = "";
        });
        document.querySelectorAll("[aria-invalid]").forEach(function (el) {
            el.removeAttribute("aria-invalid");
            el.removeAttribute("aria-errormessage");
        });
    }

    function addError(fieldId, message, focusId) {
        focusId = focusId || fieldId;
        var msgEl = document.getElementById(fieldId + "-error");
        if (msgEl) {
            msgEl.textContent = message;
            msgEl.hidden = false;
        }
        var input = document.getElementById(focusId);
        if (input) {
            input.setAttribute("aria-invalid", "true");
            input.setAttribute("aria-errormessage", fieldId + "-error");
        }
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + focusId;
        a.textContent = message;
        li.appendChild(a);
        errorListEl.appendChild(li);
    }

    function showErrorSummaryAndFocus() {
        errorSummaryEl.hidden = false;
        errorSummaryEl.focus();
    }

    // ---- Per-step validation ----

    function validateReason() {
        clearErrors();
        var reason = getReason();
        var ok = true;
        if (!reason) {
            addError("reason", "Select a reason for your appointment", "reason-routine");
            ok = false;
        } else if (reason === "other" && !getReasonOtherDetail()) {
            addError("reason-other", "Enter details about your appointment", "reason-other-detail");
            ok = false;
        }
        return ok;
    }

    function validateDateTime() {
        clearErrors();
        var ok = true;
        var date = getAppointmentDate();
        if (!date) {
            addError("appointment-date", "Enter your preferred date");
            ok = false;
        } else if (date < todayIso()) {
            addError("appointment-date", "Enter a date that is today or in the future");
            ok = false;
        }
        if (!getAppointmentTime()) {
            addError("appointment-time", "Select a preferred time of day");
            ok = false;
        }
        return ok;
    }

    function validateDetails() {
        clearErrors();
        var ok = true;
        if (!getFullName()) {
            addError("full-name", "Enter your full name");
            ok = false;
        }
        var email = getEmail();
        if (!email) {
            addError("email", "Enter your email address");
            ok = false;
        } else if (email.indexOf("@") === -1) {
            addError("email", "Enter an email address in the correct format");
            ok = false;
        }
        return ok;
    }

    function validateCheckAnswers() {
        clearErrors();
        if (!getConfirmedAccurate()) {
            addError("confirmed-accurate", "Confirm that the information above is correct");
            return false;
        }
        return true;
    }

    // ---- Step navigation + focus management ----
    //
    // A single-page wizard gets no route change for the browser (or a
    // screen reader) to announce on its own, so every transition moves
    // focus to the new step's own <h2 tabindex="-1"> by hand -- the
    // same outcome a real navigation gives other pages in this app.

    function showStep(n) {
        for (var i = 0; i <= 5; i++) {
            var panel = document.getElementById("step-panel-" + i);
            if (panel) panel.hidden = i !== n;
        }

        if (n >= 1 && n <= 4) {
            stepListEl.hidden = false;
            updateStepList(n);
        } else {
            stepListEl.hidden = true;
        }

        if (n === 4) renderSummary();

        var heading = document.getElementById("step-" + n + "-heading");
        if (heading) heading.focus();
    }

    function updateStepList(n) {
        for (var i = 1; i <= 4; i++) {
            var li = document.getElementById("step-list-item-" + i);
            if (!li) continue;
            var status = i < n ? "finished" : i === n ? "in-progress" : "waiting";
            li.setAttribute("data-status", status);
            if (i === n) {
                li.setAttribute("aria-current", "step");
            } else {
                li.removeAttribute("aria-current");
            }
        }
    }

    function goNext(validateFn, next) {
        if (validateFn()) {
            showStep(next);
        } else {
            showErrorSummaryAndFocus();
        }
    }

    function goBack(prev) {
        clearErrors();
        showStep(prev);
    }

    function goToStep(n) {
        clearErrors();
        showStep(n);
    }

    function renderSummary() {
        var reason = getReason();
        document.getElementById("summary-reason-value").textContent = reason
            ? REASON_LABELS[reason]
            : "Not answered";

        var otherDetailEl = document.getElementById("summary-reason-other-detail");
        if (reason === "other" && getReasonOtherDetail()) {
            otherDetailEl.hidden = false;
            otherDetailEl.textContent = getReasonOtherDetail();
        } else {
            otherDetailEl.hidden = true;
            otherDetailEl.textContent = "";
        }

        document.getElementById("summary-date-value").textContent =
            getAppointmentDate() || "Not answered";

        var time = getAppointmentTime();
        document.getElementById("summary-time-value").textContent = time
            ? TIME_LABELS[time]
            : "Not answered";

        document.getElementById("summary-name-value").textContent = getFullName() || "Not answered";
        document.getElementById("summary-email-value").textContent = getEmail() || "Not answered";

        var phoneValueEl = document.getElementById("summary-phone-value");
        var phone = getPhone();
        phoneValueEl.innerHTML = "";
        if (phone) {
            phoneValueEl.textContent = phone;
        } else {
            var tag = document.createElement("span");
            tag.className = "status-tag";
            tag.setAttribute("role", "status");
            tag.setAttribute("data-type", "info");
            tag.textContent = "Not provided";
            phoneValueEl.appendChild(tag);
        }

        document.getElementById("summary-support-value").textContent = getNeedsSupport()
            ? "Yes"
            : "No";
    }

    function submitBooking() {
        if (!validateCheckAnswers()) {
            showErrorSummaryAndFocus();
            return;
        }
        var referenceNumber = "APT-" + Math.floor(100000 + Math.random() * 900000);
        document.getElementById("reference-number").textContent = referenceNumber;
        document.getElementById("confirmation-email").textContent = getEmail();

        var time = getAppointmentTime();
        var timeLabel = time ? TIME_LABELS[time].toLowerCase() : "";
        document.getElementById("what-happens-next-text").textContent =
            "A member of the practice team will confirm your " +
            timeLabel +
            " appointment on " +
            getAppointmentDate() +
            " by email. Keep your reference number in case you need to change or cancel.";

        showStep(5);
    }

    function updateCharacterCounter() {
        var len = reasonOtherTextarea.value.length;
        characterCounterEl.setAttribute("data-count", String(len));
        characterCounterEl.textContent = len + " / 250";
    }

    function startOver() {
        reasonForm.reset();
        dateTimeForm.reset();
        detailsForm.reset();
        confirmForm.reset();
        reasonOtherBlock.hidden = true;
        updateCharacterCounter();
        clearErrors();
        showStep(0);
    }

    // ---- Wire it all up ----

    document.getElementById("start-now-btn").addEventListener("click", function () {
        goToStep(1);
    });

    document.querySelectorAll('input[name="reason"]').forEach(function (radio) {
        radio.addEventListener("change", function () {
            reasonOtherBlock.hidden = getReason() !== "other";
        });
    });

    reasonOtherTextarea.addEventListener("input", updateCharacterCounter);

    reasonForm.addEventListener("submit", function (e) {
        e.preventDefault();
        goNext(validateReason, 2);
    });

    dateTimeForm.addEventListener("submit", function (e) {
        e.preventDefault();
        goNext(validateDateTime, 3);
    });
    document.getElementById("date-time-back-btn").addEventListener("click", function () {
        goBack(1);
    });

    detailsForm.addEventListener("submit", function (e) {
        e.preventDefault();
        goNext(validateDetails, 4);
    });
    document.getElementById("details-back-btn").addEventListener("click", function () {
        goBack(2);
    });

    document.getElementById("check-answers-back-btn").addEventListener("click", function () {
        goBack(3);
    });
    confirmForm.addEventListener("submit", function (e) {
        e.preventDefault();
        submitBooking();
    });

    document.querySelectorAll(".summary-change-link").forEach(function (a) {
        a.addEventListener("click", function (e) {
            e.preventDefault();
            goToStep(parseInt(a.getAttribute("data-goto-step"), 10));
        });
    });

    document.getElementById("start-over-btn").addEventListener("click", function () {
        startOver();
    });
})();
