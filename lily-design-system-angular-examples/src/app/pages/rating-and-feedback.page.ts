import { Component, ChangeDetectionStrategy } from "@angular/core";
import { FiveStarRatingPicker, FiveFaceRatingPicker, NetPromoterScorePicker } from "lily-design-system-angular-headless";

@Component({
  selector: "lily-rating-and-feedback",
  standalone: true,
  imports: [FiveStarRatingPicker, FiveFaceRatingPicker, NetPromoterScorePicker],
  template: `
    <article class="page-wrapper">
      <h1>Rating and feedback</h1>

      <h2>Five-star</h2>
      <lily-five-star-rating-picker label="Star rating" />

      <h2>Five-face</h2>
      <lily-five-face-rating-picker label="Face rating" />

      <h2>Net promoter score</h2>
      <lily-net-promoter-score-picker label="NPS" />
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RatingAndFeedbackPage {

}
