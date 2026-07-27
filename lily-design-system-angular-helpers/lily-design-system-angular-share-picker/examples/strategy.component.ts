/*
    Example 2 — Choosing between the native sheet and the list.

    `strategy` decides what pressing the button does:

      "auto"   (default) — use navigator.share when the browser has it,
                           otherwise open the list. A phone gets the OS
                           sheet with the user's real installed apps; a
                           desktop gets the in-page list.
      "native"           — always attempt the sheet.
      "list"             — never attempt it; always show the list.

    "auto" is usually right, and it is also the one that makes your
    support scripts harder to write: the same button behaves differently
    on different devices, so "click Share, then click Email" is not a
    sentence you can write. Pick "list" when a single documented flow
    matters more than the native affordance.

    A dismissed sheet ENDS the interaction. The user closing the OS
    sheet rejects the navigator.share() promise, and the list does not
    then pop open — that would resurrect UI they just dismissed. So with
    "native" on a device that has a sheet, `targets` may never be seen;
    keep the copy item available for the fallback path regardless.

    `nativeShare` fires only on the native path, so it is the hook for
    "the OS took over from here" — note it cannot tell you WHERE the
    user shared, by design: the OS does not report that back.
*/
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import {
    ShareChooser,
    canShareNatively,
    type ShareStrategy,
    type ShareTarget,
} from "../share-chooser.component";

@Component({
    selector: "example-strategy",
    standalone: true,
    imports: [ShareChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <fieldset>
            <legend>Strategy</legend>
            @for (option of options; track option) {
                <label>
                    <input
                        type="radio"
                        name="strategy"
                        [value]="option"
                        [checked]="strategy() === option"
                        (change)="strategy.set(option)"
                    />
                    {{ option }}
                </label>
            }
        </fieldset>

        <lily-share-chooser
            label="Share this page"
            [strategy]="strategy()"
            [targets]="targets"
            copyLabel="Copy link"
            copiedLabel="Link copied"
            copyFailedLabel="Could not copy — copy it from the address bar"
            (nativeShare)="lastNative.set($event)"
        />

        <p class="share-chooser-status" aria-live="polite">
            @if (lastNative()) {
                Handed off to the system share sheet.
            }
        </p>

        <p>
            This browser
            {{ hasNativeSheet ? "has" : "does not have" }} a native share
            sheet, so "auto" behaves like
            {{ hasNativeSheet ? '"native"' : '"list"' }} here.
        </p>
    `,
})
export class StrategyExample {
    readonly options: ShareStrategy[] = ["auto", "native", "list"];
    readonly strategy = signal<ShareStrategy>("auto");
    readonly lastNative = signal("");

    // Read once at construction: capability, not state. Safe under SSR
    // because canShareNatively() guards on `typeof navigator`.
    readonly hasNativeSheet = canShareNatively();

    readonly targets: ShareTarget[] = [
        {
            id: "mastodon",
            label: "Mastodon",
            href: (url) =>
                `https://mastodon.social/share?text=${encodeURIComponent(url)}`,
        },
    ];
}
