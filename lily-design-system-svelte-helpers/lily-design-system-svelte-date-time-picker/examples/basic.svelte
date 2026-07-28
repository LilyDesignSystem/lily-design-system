<script lang="ts">
    // The smallest useful call site: a labelled field, a locale, and the
    // six required strings.
    import DateTimePicker from "../index.ts";

    let appointment = $state("");

    const labels = {
        previousYear: "Previous year",
        previousMonth: "Previous month",
        nextMonth: "Next month",
        nextYear: "Next year",
        confirm: "OK",
        cancel: "Cancel",
    };
</script>

<h1>Date picker — basic</h1>

<label for="appointment">Appointment date</label>
<div id="appointment-hint">For example, 27 Jun 2026</div>

<DateTimePicker
    inputId="appointment"
    describedBy="appointment-hint"
    name="appointment"
    label="Choose an appointment date"
    locale="en-GB"
    placeholder="DD MMM YYYY"
    bind:value={appointment}
    {labels}
/>

<p>Value posted to the server: <code>{appointment || "(empty)"}</code></p>

<style>
    /* The package ships no CSS. Without at least this much, the dialog
       renders in normal flow instead of over the page. */
    :global(.date-time-picker) {
        position: relative;
        display: inline-block;
    }
    :global(.date-time-picker-dialog) {
        position: absolute;
        z-index: 10;
        inset-inline-start: 0;
        background: Canvas;
        border: 1px solid;
        padding: 0.5rem;
    }
    :global(.date-time-picker-dialog[hidden]) {
        display: none;
    }
    :global(.date-time-picker-day[data-outside]) {
        opacity: 0.5;
    }
    :global(.date-time-picker-day[data-selected]) {
        outline: 2px solid;
    }
</style>
