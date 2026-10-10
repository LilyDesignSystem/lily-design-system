/*
    Example 4 — Custom labels.

    Default labels title-case the slug ("x-large" → "X Large"). Pass
    `sizeLabels` to override per-slug — useful for i18n or for slugs
    that don't gracefully title-case.

    The component ships no natural-language strings of its own, so
    every user-facing word here comes from the consumer: `label`, the
    `sizeLabels` values, and any status text. `label` matters most: the
    button is icon-only, so it is the control's ENTIRE accessible name.
    An untranslated `label` leaves the control announced in the wrong
    language; an empty one leaves it announced as just "button".
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TextSizePicker } from "../text-size-picker.component";

@Component({
  selector: "example-custom-labels",
  standalone: true,
  imports: [TextSizePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lily-text-size-picker
      label="Taille du texte"
      [sizes]="['small', 'medium', 'large', 'x-large']"
      [sizeLabels]="labels"
    />
  `,
})
export class CustomLabelsExample {
  readonly labels: Record<string, string> = {
    small: "Petit",
    medium: "Moyen",
    large: "Grand",
    "x-large": "Très grand",
  };
}
