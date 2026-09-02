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

      <lily-timeline-list label="Project history">
        <li lily-timeline-list-item>Kickoff</li>
        <li lily-timeline-list-item>Design review</li>
        <li lily-timeline-list-item>Launch</li>
      </lily-timeline-list>

      <lily-card>
        <h2>Sample card</h2>
        <!-- Direct class-hook markup: DateRange/ReviewDate's Angular
             implementation renders a <div>, not the canonical <span>
             (components/date-range/AGENTS.md, components/review-date/AGENTS.md)
             — a separate, pre-existing defect from the list/table wrapper-host
             issue this page used to work around; not fixed here. -->
        <p><span class="date-range">January – March 2026</span></p>
        <p><span class="review-date">Last reviewed 26 August 2026</span></p>
      </lily-card>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TimelineAndCardsPage {

}
