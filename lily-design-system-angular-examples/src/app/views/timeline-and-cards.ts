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
        <lily-date-range
          label="Project dates"
          startLabel="Start date"
          endLabel="End date"
          start="2026-01-01"
          end="2026-03-31"
        />
        <p>
          <lily-review-date label="Last reviewed" datetime="2026-08-26">Last reviewed 26 August 2026</lily-review-date>
        </p>
      </lily-card>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TimelineAndCardsPage {

}
