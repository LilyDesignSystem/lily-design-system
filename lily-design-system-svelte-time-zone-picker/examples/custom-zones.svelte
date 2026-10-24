<!-- A short list of the zones a team works in, with its own option text. -->
<script lang="ts">
  import TimeZonePicker from "@lilydesignsystem/svelte-time-zone-picker";
</script>

<TimeZonePicker
  label="Meeting time zone"
  locale="fr"
  zones={["America/New_York", "Europe/Paris", "Asia/Kolkata", "Asia/Tokyo"]}
  defaultValue="Europe/Paris"
  labelFor={(z) => `${z.name} (${z.offset})`}
/>
