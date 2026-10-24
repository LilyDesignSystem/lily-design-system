import { useState } from "react";
import TimeZonePicker from "@lilydesignsystem/react-time-zone-picker";

// Basic usage: a label and the reader's locale. The zones are the built-in list, ordered by offset; the picker
// starts on the reader's own zone (or its listed twin) and sets data-time-zone on <html>.
// Use the zone where you format dates:  new Intl.DateTimeFormat(locale, { timeZone }).format(date)
export function Basic() {
  const [zone, setZone] = useState("");
  return (
    <>
      <TimeZonePicker label="Time zone" locale="en-GB" onChange={setZone} storageKey="lily-time-zone" />
      <p aria-live="polite">
        {zone ? new Intl.DateTimeFormat("en-GB", { timeZone: zone, dateStyle: "medium", timeStyle: "short" }).format(new Date()) : ""}
      </p>
    </>
  );
}
