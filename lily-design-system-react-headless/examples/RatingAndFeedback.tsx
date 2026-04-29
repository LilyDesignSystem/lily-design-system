// Example: Rating and feedback collection
//
// Demonstrates: FiveStarRatingPicker, FiveStarRatingView, FiveFaceRatingPicker,
// NetPromoterScorePicker, TextAreaInput, Button, Alert, Form

import { useState } from "react";
import FiveStarRatingPicker from "../components/FiveStarRatingPicker";
import FiveStarRatingView from "../components/FiveStarRatingView";
import FiveFaceRatingPicker from "../components/FiveFaceRatingPicker";
import NetPromoterScorePicker from "../components/NetPromoterScorePicker";
import TextAreaInput from "../components/TextAreaInput";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Form from "../components/Form";
import Separator from "../components/Separator";

export default function RatingAndFeedback() {
    const [stars, setStars] = useState(0);
    const [satisfaction, setSatisfaction] = useState(0);
    const [nps, setNps] = useState(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitted(true);
    }

    if (submitted) {
        return (
            <div>
                <Alert type="success" heading="Thank you!">
                    Your feedback has been recorded.
                </Alert>
                <div>
                    <p>Your product rating:</p>
                    <FiveStarRatingView label="Your rating" value={stars} />
                </div>
            </div>
        );
    }

    return (
        <Form label="Feedback form" onSubmit={handleSubmit}>
            <h2>We value your feedback</h2>

            <div>
                <h3>Rate this product</h3>
                <FiveStarRatingPicker
                    label="Product rating"
                    value={stars}
                    onChange={setStars}
                />
            </div>

            <Separator />

            <div>
                <h3>How satisfied are you with our service?</h3>
                <FiveFaceRatingPicker
                    label="Service satisfaction"
                    value={satisfaction}
                    onChange={setSatisfaction}
                />
            </div>

            <Separator />

            <div>
                <h3>How likely are you to recommend us?</h3>
                <NetPromoterScorePicker
                    label="Recommendation likelihood"
                    value={nps}
                    onChange={setNps}
                />
            </div>

            <Separator />

            <div>
                <h3>Additional comments</h3>
                <TextAreaInput
                    label="Comments"
                    value={comment}
                    onChange={setComment}
                    rows={4}
                />
            </div>

            <Button type="submit">Submit Feedback</Button>
        </Form>
    );
}
