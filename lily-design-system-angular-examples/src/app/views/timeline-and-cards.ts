import { Component, ChangeDetectionStrategy } from "@angular/core";
import { TimelineList } from "../components/TimelineList";
import { TimelineListItem } from "../components/TimelineListItem";
import { Card } from "../components/Card";
import { DateRange } from "../components/DateRange";
import { ReviewDate } from "../components/ReviewDate";

@Component({
  selector: "lily-timeline-and-cards",
  standalone: true,
  imports: [TimelineList, TimelineListItem, Card, DateRange, ReviewDate],
  template: `
    <article class="page-wrapper">
      <h1>Timeline and cards</h1>

      <!-- Direct class-hook markup: Angular's element-selector wrapper
           hosts break the required ol>li DOM parent-child structure
           (axe: list / listitem). Lily is headless — the kebab-case
           class hooks ARE the contract, so plain semantic HTML is the
           correct consumption here. -->
      <ol class="timeline-list" aria-label="Project history">
        <li class="timeline-list-item">Kickoff</li>
        <li class="timeline-list-item">Design review</li>
        <li class="timeline-list-item">Launch</li>
      </ol>

      <lily-card>
        <h2>Sample card</h2>
        <p><span class="date-range">January – March 2026</span></p>
        <p><span class="review-date">Last reviewed 26 August 2026</span></p>
      </lily-card>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TimelineAndCardsPage {

}
