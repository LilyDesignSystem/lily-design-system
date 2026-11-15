import { Component, ChangeDetectionStrategy } from "@angular/core";
import { FiveStarRatingRadioGroup } from "../components/FiveStarRatingRadioGroup";
import { FiveStarRatingRadioInput } from "../components/FiveStarRatingRadioInput";
import { FiveFaceRatingRadioGroup } from "../components/FiveFaceRatingRadioGroup";
import { FiveFaceRatingRadioInput } from "../components/FiveFaceRatingRadioInput";
import { NetPromoterScoreRadioGroup } from "../components/NetPromoterScoreRadioGroup";
import { NetPromoterScoreRadioInput } from "../components/NetPromoterScoreRadioInput";

@Component({
    selector: "lily-rating-and-feedback",
    standalone: true,
    imports: [
        FiveStarRatingRadioGroup,
        FiveStarRatingRadioInput,
        FiveFaceRatingRadioGroup,
        FiveFaceRatingRadioInput,
        NetPromoterScoreRadioGroup,
        NetPromoterScoreRadioInput,
    ],
    template: `
    <article class="page-wrapper">
      <h1>Rating and feedback</h1>

      <h2>Five-star</h2>
      <lily-five-star-rating-radio-group label="Star rating">
        @for (o of stars; track o[0]) {
          <label><lily-five-star-rating-radio-input [label]="o[1]" name="stars" [value]="o[0]" /> {{ o[1] }}</label>
        }
      </lily-five-star-rating-radio-group>

      <h2>Five-face</h2>
      <lily-five-face-rating-radio-group label="Face rating">
        @for (o of faces; track o[0]) {
          <label><lily-five-face-rating-radio-input [label]="o[1]" name="faces" [value]="o[0]" /> {{ o[1] }}</label>
        }
      </lily-five-face-rating-radio-group>

      <h2>Net promoter score</h2>
      <lily-net-promoter-score-radio-group label="NPS">
        @for (o of scores; track o[0]) {
          <label><lily-net-promoter-score-radio-input [label]="o[1]" name="scores" [value]="o[0]" /> {{ o[1] }}</label>
        }
      </lily-net-promoter-score-radio-group>
    </article>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RatingAndFeedbackPage {
    protected readonly stars = [
        ["1", "1 star"],
        ["2", "2 stars"],
        ["3", "3 stars"],
        ["4", "4 stars"],
        ["5", "5 stars"],
    ];
    protected readonly faces = [
        ["1", "Very dissatisfied"],
        ["2", "Dissatisfied"],
        ["3", "Neutral"],
        ["4", "Satisfied"],
        ["5", "Very satisfied"],
    ];
    protected readonly scores = Array.from({ length: 11 }, (_, i) => [String(i), String(i)]);
}
