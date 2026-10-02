/*
    Example 1 — Basic usage.

    A search for "foo" performs a GET to "/?foo". Every user-facing
    string is an input: the trigger, the field, and the ⏎ button each get
    a localisable accessible name.

    `navigate` is not passed, so the component calls location.assign —
    a full page load. In a single-page app, pass a function that hands
    the href to your router instead (see ../index.md).

    The package ships zero CSS: without `position: relative` on
    .search-picker and `position: absolute` on .search-picker-panel, the
    open panel pushes page content around.
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
  SearchPicker,
  type SearchEvent,
} from "../search-picker.component";

@Component({
  selector: "example-basic",
  standalone: true,
  imports: [SearchPicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lily-search-picker
      label="Search this site"
      inputLabel="Search terms"
      submitLabel="Search"
      placeholder="Search…"
      (searched)="onSearched($event)"
    />
  `,
})
export class BasicExample {
  onSearched(event: SearchEvent): void {
    console.log("searching for", event.query, "at", event.href);
  }
}
