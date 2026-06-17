import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
  output,
} from "@angular/core";

/** Normalise the themes directory URL to end with exactly one "/". */
export function normaliseThemesUrl(themesUrl: string): string {
  return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
}

/** Construct the href for a given theme slug. */
export function themeHref(themesUrl: string, slug: string, extension: string): string {
  return normaliseThemesUrl(themesUrl) + slug + extension;
}

/**
 * ThemeSelect — dynamic theme CSS loader.
 *
 * Renders an accessible native `<select>` of themes. On every theme
 * change the picker swaps `href` on a managed `<link rel="stylesheet">`
 * in `document.head` and sets `data-theme="{slug}"` on the document root
 * (or on a consumer-supplied target). See `spec.md` for the full
 * contract.
 */
@Component({
  selector: "lily-theme-select",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <select
      class="theme-select {{ className() }}"
      [attr.aria-label]="label() || null"
      [name]="name()"
      (change)="onInputChange($any($event.target).value)"
    >
      @for (theme of themes(); track theme) {
        <option
          class="theme-select-option"
          [value]="theme"
          [selected]="value() === theme"
        >{{ labelFor(theme) }}</option>
      }
    </select>
  `,
})
export class ThemeSelect {
  readonly label = input.required<string>();
  readonly themesUrl = input.required<string>();
  readonly themes = input.required<string[]>();
  readonly value = model<string>("");
  readonly defaultValue = input<string>("");
  readonly storageKey = input<string>("");
  readonly name = input<string>("theme");
  readonly extension = input<string>(".css");
  readonly target = input<HTMLElement | null>(null);
  readonly themeLabels = input<Record<string, string>>({});
  readonly className = input<string>("");
  readonly themeChange = output<string>();

  private initialised = false;

  constructor() {
    effect(() => {
      const current = this.value();

      if (!this.initialised) {
        this.initialised = true;
        let initial = current;

        const sk = this.storageKey();
        if (!initial && sk) {
          try {
            initial = (typeof localStorage !== "undefined"
              ? localStorage.getItem(sk)
              : null) ?? "";
          } catch {
            // ignore privacy errors
          }
        }

        if (!initial) {
          const themes = this.themes();
          const dv = this.defaultValue();
          initial =
            dv ||
            (themes.includes("light") ? "light" : themes[0]) ||
            "";
        }

        if (initial && initial !== current) {
          this.value.set(initial);
          return;
        }
      }

      if (current) this.applyTheme(current);
    });
  }

  labelFor(theme: string): string {
    const labels = this.themeLabels();
    if (theme in labels) return labels[theme];
    return theme.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }

  onInputChange(next: string): void {
    this.value.set(next);
  }

  private getManagedLink(): HTMLLinkElement | null {
    if (typeof document === "undefined") return null;
    const selector = `link[data-lily-theme-select="${this.name()}"]`;
    let link = document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.setAttribute("data-lily-theme-select", this.name());
      document.head.appendChild(link);
    }
    return link;
  }

  private applyTheme(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    const link = this.getManagedLink();
    if (link) link.href = themeHref(this.themesUrl(), slug, this.extension());
    (this.target() ?? document.documentElement).setAttribute("data-theme", slug);

    const sk = this.storageKey();
    if (sk) {
      try {
        localStorage.setItem(sk, slug);
      } catch {
        // ignore quota / privacy errors
      }
    }
    this.themeChange.emit(slug);
  }
}
