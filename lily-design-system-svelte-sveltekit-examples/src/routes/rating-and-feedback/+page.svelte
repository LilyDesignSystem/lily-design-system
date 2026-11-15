<script lang="ts">
    import FiveStarRatingRadioGroup from "#lib/components/FiveStarRatingRadioGroup/FiveStarRatingRadioGroup.svelte";
    import FiveStarRatingRadioInput from "#lib/components/FiveStarRatingRadioInput/FiveStarRatingRadioInput.svelte";
    import FiveStarRatingView from "#lib/components/FiveStarRatingView/FiveStarRatingView.svelte";
    import FiveFaceRatingRadioGroup from "#lib/components/FiveFaceRatingRadioGroup/FiveFaceRatingRadioGroup.svelte";
    import FiveFaceRatingRadioInput from "#lib/components/FiveFaceRatingRadioInput/FiveFaceRatingRadioInput.svelte";
    import FiveFaceRatingView from "#lib/components/FiveFaceRatingView/FiveFaceRatingView.svelte";
    import NetPromoterScoreRadioGroup from "#lib/components/NetPromoterScoreRadioGroup/NetPromoterScoreRadioGroup.svelte";
    import NetPromoterScoreRadioInput from "#lib/components/NetPromoterScoreRadioInput/NetPromoterScoreRadioInput.svelte";
    import NetPromoterScoreView from "#lib/components/NetPromoterScoreView/NetPromoterScoreView.svelte";
    import RedAmberGreenRadioGroup from "#lib/components/RedAmberGreenRadioGroup/RedAmberGreenRadioGroup.svelte";
    import RedAmberGreenRadioInput from "#lib/components/RedAmberGreenRadioInput/RedAmberGreenRadioInput.svelte";
    import RedAmberGreenView from "#lib/components/RedAmberGreenView/RedAmberGreenView.svelte";
    import RedOrangeYellowGreenBlueRadioGroup from "#lib/components/RedOrangeYellowGreenBlueRadioGroup/RedOrangeYellowGreenBlueRadioGroup.svelte";
    import RedOrangeYellowGreenBlueRadioInput from "#lib/components/RedOrangeYellowGreenBlueRadioInput/RedOrangeYellowGreenBlueRadioInput.svelte";
    import RedOrangeYellowGreenBlueView from "#lib/components/RedOrangeYellowGreenBlueView/RedOrangeYellowGreenBlueView.svelte";
    import Form from "#lib/components/Form/Form.svelte";
    import Field from "#lib/components/Field/Field.svelte";
    import TextAreaInput from "#lib/components/TextAreaInput/TextAreaInput.svelte";
    import Button from "#lib/components/Button/Button.svelte";
    import Card from "#lib/components/Card/Card.svelte";
    import Separator from "#lib/components/Separator/Separator.svelte";
    import Header from "#lib/components/Header/Header.svelte";
    import Footer from "#lib/components/Footer/Footer.svelte";
    import BackLink from "#lib/components/BackLink/BackLink.svelte";

    let starRating = $state(0);
    let faceRating = $state(0);
    let npsScore = $state("");
    let ragStatus = $state("");
    let roygbStatus = $state("");
    let feedbackText = $state("");
    let submitted = $state(false);

    function handleSubmit() {
        submitted = true;
    }
</script>

<Header label="Site header">
    <div class="page-wrapper">
        <h1>Rating & Feedback</h1>
    </div>
</Header>

<main class="page-wrapper">
    <BackLink href="/">Back to examples</BackLink>

    {#if submitted}
        <Card
            heading="Thank you for your feedback"
            headingLevel={2}
        >
            <p>Your ratings have been recorded:</p>
            <ul>
                <li>
                    Star rating: <FiveStarRatingView
                        value={starRating}
                        label="Your star rating"
                    />
                </li>
                <li>
                    Face rating: <FiveFaceRatingView
                        value={faceRating}
                        label="Your face rating"
                    />
                </li>
                <li>
                    NPS: <NetPromoterScoreView
                        label="Your NPS score"
                        value={npsScore}
                    />
                </li>
                <li>
                    RAG status: <RedAmberGreenView
                        label="Your RAG status"
                        value={ragStatus}
                    />
                </li>
                <li>
                    ROYGB status: <RedOrangeYellowGreenBlueView
                        label="Your ROYGB status"
                        value={roygbStatus}
                    />
                </li>
            </ul>
            {#if feedbackText}
                <p><strong>Comments:</strong> {feedbackText}</p>
            {/if}
            <Button
                onclick={() => {
                    submitted = false;
                }}>Give new feedback</Button
            >
        </Card>
    {:else}
        <Form
            label="Feedback form"
            onsubmit={handleSubmit}
        >
            <h2>Five-Star Rating</h2>
            <Card
                heading="Rate your experience"
                headingLevel={3}
            >
                <p>How would you rate the service overall?</p>
                <FiveStarRatingRadioGroup label="Service rating">
                    {#each [["1", "1 star"], ["2", "2 stars"], ["3", "3 stars"], ["4", "4 stars"], ["5", "5 stars"]] as [value, text]}
                        <label>
                            <FiveStarRatingRadioInput
                                label={text}
                                name="star-rating"
                                {value}
                                checked={String(starRating) === value}
                                onchange={() => (starRating = Number(value))}
                            />
                            {text}
                        </label>
                    {/each}
                </FiveStarRatingRadioGroup>
                {#if starRating > 0}
                    <p style="margin-top: var(--nhs-space-2);">
                        You selected: <FiveStarRatingView
                            value={starRating}
                            label="Selected star rating"
                        />
                    </p>
                {/if}
            </Card>

            <Separator />

            <h2>Five-Face Rating</h2>
            <Card
                heading="How did we do?"
                headingLevel={3}
            >
                <p>Select the face that best represents your experience.</p>
                <FiveFaceRatingRadioGroup label="Experience rating">
                    {#each [["1", "Very dissatisfied"], ["2", "Dissatisfied"], ["3", "Neutral"], ["4", "Satisfied"], ["5", "Very satisfied"]] as [value, text]}
                        <label>
                            <FiveFaceRatingRadioInput
                                label={text}
                                name="face-rating"
                                {value}
                                checked={String(faceRating) === value}
                                onchange={() => (faceRating = Number(value))}
                            />
                            {text}
                        </label>
                    {/each}
                </FiveFaceRatingRadioGroup>
                {#if faceRating > 0}
                    <p style="margin-top: var(--nhs-space-2);">
                        You selected: <FiveFaceRatingView
                            value={faceRating}
                            label="Selected face rating"
                        />
                    </p>
                {/if}
            </Card>

            <Separator />

            <h2>Net Promoter Score</h2>
            <Card
                heading="How likely are you to recommend us?"
                headingLevel={3}
            >
                <p>On a scale of 0 to 10, how likely are you to recommend this service?</p>
                <NetPromoterScoreRadioGroup label="NPS rating">
                    {#each [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"]] as [value, text]}
                        <label>
                            <NetPromoterScoreRadioInput
                                label={text}
                                name="nps"
                                {value}
                                checked={String(npsScore) === value}
                                onchange={() => (npsScore = value)}
                            />
                            {text}
                        </label>
                    {/each}
                </NetPromoterScoreRadioGroup>
                {#if npsScore}
                    <p style="margin-top: var(--nhs-space-2);">
                        Score: <NetPromoterScoreView
                            label="Selected NPS"
                            value={npsScore}
                        />
                    </p>
                {/if}
            </Card>

            <Separator />

            <h2>RAG Status</h2>
            <Card
                heading="Project status"
                headingLevel={3}
            >
                <p>Select the current status of this project.</p>
                <RedAmberGreenRadioGroup label="Project RAG status">
                    {#each [["red", "Off track"], ["amber", "At risk"], ["green", "On track"]] as [value, text]}
                        <label>
                            <RedAmberGreenRadioInput
                                label={text}
                                name="rag"
                                {value}
                                checked={String(ragStatus) === value}
                                onchange={() => (ragStatus = value)}
                            />
                            {text}
                        </label>
                    {/each}
                </RedAmberGreenRadioGroup>
                {#if ragStatus}
                    <p style="margin-top: var(--nhs-space-2);">
                        Status: <RedAmberGreenView
                            label="Selected RAG"
                            value={ragStatus}
                        />
                    </p>
                {/if}
            </Card>

            <Separator />

            <h2>Five-Level Colour Status</h2>
            <Card
                heading="Risk assessment"
                headingLevel={3}
            >
                <p>Select the risk level.</p>
                <RedOrangeYellowGreenBlueRadioGroup label="Risk level">
                    {#each [["red", "Severe"], ["orange", "High"], ["yellow", "Moderate"], ["green", "Low"], ["blue", "Minimal"]] as [value, text]}
                        <label>
                            <RedOrangeYellowGreenBlueRadioInput
                                label={text}
                                name="roygb"
                                {value}
                                checked={String(roygbStatus) === value}
                                onchange={() => (roygbStatus = value)}
                            />
                            {text}
                        </label>
                    {/each}
                </RedOrangeYellowGreenBlueRadioGroup>
                {#if roygbStatus}
                    <p style="margin-top: var(--nhs-space-2);">
                        Level: <RedOrangeYellowGreenBlueView
                            label="Selected level"
                            value={roygbStatus}
                        />
                    </p>
                {/if}
            </Card>

            <Separator />

            <h2>Additional Comments</h2>
            <Field label="Your comments">
                <TextAreaInput
                    label="Additional feedback"
                    bind:value={feedbackText}
                />
            </Field>

            <Button type="submit">Submit Feedback</Button>
        </Form>
    {/if}
</main>

<Footer label="Site footer">
    <div class="page-wrapper">
        <p>Lily Design System — Rating & Feedback Example</p>
    </div>
</Footer>
