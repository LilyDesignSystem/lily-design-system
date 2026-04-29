"use client";

import { useState } from "react";
import FiveStarRatingPicker from "@pgds/FiveStarRatingPicker";
import FiveStarRatingView from "@pgds/FiveStarRatingView";
import FiveFaceRatingPicker from "@pgds/FiveFaceRatingPicker";
import NetPromoterScorePicker from "@pgds/NetPromoterScorePicker";
import TextAreaInput from "@pgds/TextAreaInput";
import Button from "@pgds/Button";
import Alert from "@pgds/Alert";
import Form from "@pgds/Form";
import Separator from "@pgds/Separator";

export default function RatingAndFeedbackPage() {
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
            <main>
                <Alert type="success" heading="Thank you!">
                    Your feedback has been recorded.
                </Alert>
                <div>
                    <p>Your product rating:</p>
                    <FiveStarRatingView label="Your rating" value={stars} />
                </div>
            </main>
        );
    }

    return (
        <main>
            <h1>Feedback</h1>
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
        </main>
    );
}
