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
        <lily-timeline-list-item>Kickoff</lily-timeline-list-item>
        <lily-timeline-list-item>Design review</lily-timeline-list-item>
        <lily-timeline-list-item>Launch</lily-timeline-list-item>
      </lily-timeline-list>

      <lily-card>
        <h2>Sample card</h2>
        <p><lily-date-range label="Reporting period" /></p>
        <p><lily-review-date label="Last reviewed" /></p>
      </lily-card>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TimelineAndCardsPage {

}
