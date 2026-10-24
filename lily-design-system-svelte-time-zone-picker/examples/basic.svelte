<!--
  Basic usage: a label and the reader's locale. The zones are the built-in list, ordered by offset; the picker
  starts on the reader's own zone (or its listed twin) and sets data-time-zone on <html>.

  The picker applies nothing else. Use the zone where you format dates:

    new Intl.DateTimeFormat(locale, { timeZone }).format(date)
-->
<script lang="ts">
  import TimeZonePicker from "@lilydesignsystem/svelte-time-zone-picker";

  let zone = $state("");
  const when = new Date();
</script>

<TimeZonePicker label="Time zone" locale="en-GB" bind:value={zone} storageKey="lily-time-zone" />

<p aria-live="polite">
  Now: {zone ? new Intl.DateTimeFormat("en-GB", { timeZone: zone, dateStyle: "medium", timeStyle: "short" }).format(when) : ""}
</p>
