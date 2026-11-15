"use client";

import { useState } from "react";
import FiveStarRatingRadioGroup from "@lily/FiveStarRatingRadioGroup";
import FiveStarRatingRadioInput from "@lily/FiveStarRatingRadioInput";
import FiveStarRatingView from "@lily/FiveStarRatingView";
import FiveFaceRatingRadioGroup from "@lily/FiveFaceRatingRadioGroup";
import FiveFaceRatingRadioInput from "@lily/FiveFaceRatingRadioInput";
import NetPromoterScoreRadioGroup from "@lily/NetPromoterScoreRadioGroup";
import NetPromoterScoreRadioInput from "@lily/NetPromoterScoreRadioInput";
import TextAreaInput from "@lily/TextAreaInput";
import Button from "@lily/Button";
import Alert from "@lily/Alert";
import Form from "@lily/Form";
import Separator from "@lily/Separator";

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
                <Alert
                    type="success"
                    heading="Thank you!"
                >
                    Your feedback has been recorded.
                </Alert>
                <div>
                    <p>Your product rating:</p>
                    <FiveStarRatingView
                        label="Your rating"
                        value={stars}
                    />
                </div>
            </main>
        );
    }

    return (
        <main>
            <h1>Feedback</h1>
            <Form
                label="Feedback form"
                onSubmit={handleSubmit}
            >
                <h2>We value your feedback</h2>

                <div>
                    <h3>Rate this product</h3>
                    <FiveStarRatingRadioGroup label="Product rating">
                        {[
                            ["1", "1 star"],
                            ["2", "2 stars"],
                            ["3", "3 stars"],
                            ["4", "4 stars"],
                            ["5", "5 stars"],
                        ].map(([value, text]) => (
                            <label key={value}>
                                <FiveStarRatingRadioInput
                                    label={text}
                                    name="stars"
                                    value={value}
                                    checked={stars === Number(value)}
                                    onChange={() => setStars(Number(value))}
                                />{" "}
                                {text}
                            </label>
                        ))}
                    </FiveStarRatingRadioGroup>
                </div>

                <Separator />

                <div>
                    <h3>How satisfied are you with our service?</h3>
                    <FiveFaceRatingRadioGroup label="Service satisfaction">
                        {[
                            ["1", "Very dissatisfied"],
                            ["2", "Dissatisfied"],
                            ["3", "Neutral"],
                            ["4", "Satisfied"],
                            ["5", "Very satisfied"],
                        ].map(([value, text]) => (
                            <label key={value}>
                                <FiveFaceRatingRadioInput
                                    label={text}
                                    name="satisfaction"
                                    value={value}
                                    checked={satisfaction === Number(value)}
                                    onChange={() => setSatisfaction(Number(value))}
                                />{" "}
                                {text}
                            </label>
                        ))}
                    </FiveFaceRatingRadioGroup>
                </div>

                <Separator />

                <div>
                    <h3>How likely are you to recommend us?</h3>
                    <NetPromoterScoreRadioGroup label="Recommendation likelihood">
                        {[
                            ["0", "0"],
                            ["1", "1"],
                            ["2", "2"],
                            ["3", "3"],
                            ["4", "4"],
                            ["5", "5"],
                            ["6", "6"],
                            ["7", "7"],
                            ["8", "8"],
                            ["9", "9"],
                            ["10", "10"],
                        ].map(([value, text]) => (
                            <label key={value}>
                                <NetPromoterScoreRadioInput
                                    label={text}
                                    name="nps"
                                    value={value}
                                    checked={nps === Number(value)}
                                    onChange={() => setNps(Number(value))}
                                />{" "}
                                {text}
                            </label>
                        ))}
                    </NetPromoterScoreRadioGroup>
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
