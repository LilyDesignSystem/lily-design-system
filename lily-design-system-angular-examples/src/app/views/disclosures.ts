import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from "@angular/core";
import { AccordionList } from "../components/AccordionList";
import { AccordionListItem } from "../components/AccordionListItem";
import { Banner } from "../components/Banner";
import { Coachmark } from "../components/Coachmark";
import { Collapsible } from "../components/Collapsible";
import { Expander } from "../components/Expander";
import { GovernmentBanner } from "../components/GovernmentBanner";
import { HoverCard } from "../components/HoverCard";
import { MedicalBanner } from "../components/MedicalBanner";
import { StickyPromoBanner } from "../components/StickyPromoBanner";
import { Tooltip } from "../components/Tooltip";

// Components that open, close or dismiss, with a native element or popover behind them. e2e/disclosures.spec.ts drives
// this page.
@Component({
    selector: "lily-disclosures",
    standalone: true,
    imports: [
        AccordionList,
        AccordionListItem,
        Banner,
        Coachmark,
        Collapsible,
        Expander,
        GovernmentBanner,
        HoverCard,
        MedicalBanner,
        StickyPromoBanner,
        Tooltip,
    ],
    // Angular inputs do not reach the inner element, so the anchor is named in CSS, on the class hook.
    styles: `
        .coachmark {
            position-anchor: --feature;
        }
    `,
    encapsulation: ViewEncapsulation.None,
    template: `
    <article class="page-wrapper">
      <h1>Disclosures</h1>

      <lily-expander label="More" [(expanded)]="expanded" data-testid="expander">Expanded body</lily-expander>
      <p data-testid="expander-state">Expanded: {{ expanded() }}</p>

      <lily-collapsible summary="Collapsible" [(open)]="collapsible" data-testid="collapsible"><p>Body</p></lily-collapsible>
      <p data-testid="collapsible-state">Collapsible: {{ collapsible() }}</p>

      <lily-accordion-list label="Questions">
        <li lily-accordion-list-item summary="First question" [(open)]="item" data-testid="item"><p>Answer</p></li>
      </lily-accordion-list>
      <p data-testid="item-state">Item: {{ item() }}</p>

      <lily-banner label="Notice" type="warning" [dismissible]="true" closeLabel="Dismiss notice" (closed)="closed.set(closed() + 1)" data-testid="banner">Notice</lily-banner>
      <lily-medical-banner label="Allergy" [dismissible]="true" closeLabel="Dismiss allergy" (closed)="closed.set(closed() + 1)" data-testid="medical">Allergy</lily-medical-banner>
      <p data-testid="banner-state">Closed: {{ closed() }}</p>

      <lily-government-banner label="Official" headerText="An official site" expandLabel="How you know" [(expanded)]="official" data-testid="government">
        <p>Official sites use a secure address.</p>
      </lily-government-banner>
      <p data-testid="government-state">Official: {{ official() }}</p>

      <lily-sticky-promo-banner label="Offer" dismissLabel="Dismiss offer" [open]="promo()" (dismissed)="promo.set(false)" data-testid="promo">Sale</lily-sticky-promo-banner>

      <button type="button" style="anchor-name: --feature" data-testid="coachmark-open" (click)="coachmark.set(true)">Show tip</button>
      <lily-coachmark [open]="coachmark()" title="New" dismissLabel="Close tip" (dismissed)="coachmark.set(false)" data-testid="coachmark" />

      <span style="anchor-name: --card" tabindex="0" data-testid="card-trigger" (mouseenter)="card.set(true)" (mouseleave)="card.set(false)">Profile</span>
      <lily-hover-card label="Profile" [open]="card()" data-testid="card">Card body</lily-hover-card>

      <button type="button" aria-describedby="tip" data-testid="tooltip-trigger" (focusin)="tooltip.set(true)" (focusout)="tooltip.set(false)">Help</button>
      <lily-tooltip id="tip" label="Helpful text" [visible]="tooltip()" data-testid="tooltip" />
    </article>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DisclosuresPage {
    protected readonly expanded = signal(false);
    protected readonly collapsible = signal(false);
    protected readonly item = signal(false);
    protected readonly closed = signal(0);
    protected readonly official = signal(false);
    protected readonly promo = signal(true);
    protected readonly coachmark = signal(false);
    protected readonly card = signal(false);
    protected readonly tooltip = signal(false);
}
