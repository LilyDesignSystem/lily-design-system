import { Component } from "@angular/core";
import { TimeZonePicker } from "@lilydesignsystem/angular-time-zone-picker";

// Basic usage: a label and the reader's locale. The zones are the built-in list, ordered by offset; the picker
// starts on the reader's own zone (or its listed twin) and sets data-time-zone on <html>.
// Use the zone where you format dates:  new Intl.DateTimeFormat(locale, { timeZone }).format(date)
@Component({
  selector: "app-basic",
  standalone: true,
  imports: [TimeZonePicker],
  template: `
    <lily-time-zone-picker label="Time zone" locale="en-GB" [(value)]="zone" storageKey="lily-time-zone" />
    <p aria-live="polite">{{ now() }}</p>
  `,
})
export class Basic {
  zone = "";
  now(): string {
    return this.zone ? new Intl.DateTimeFormat("en-GB", { timeZone: this.zone, dateStyle: "medium", timeStyle: "short" }).format(new Date()) : "";
  }
}
