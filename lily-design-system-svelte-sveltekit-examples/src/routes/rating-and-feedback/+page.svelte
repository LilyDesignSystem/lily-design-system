<script lang="ts">
    import FiveStarRatingPicker from "$lib/components/FiveStarRatingPicker.svelte";
    import FiveStarRatingView from "$lib/components/FiveStarRatingView.svelte";
    import FiveFaceRatingPicker from "$lib/components/FiveFaceRatingPicker.svelte";
    import FiveFaceRatingView from "$lib/components/FiveFaceRatingView.svelte";
    import NetPromoterScorePicker from "$lib/components/NetPromoterScorePicker.svelte";
    import NetPromoterScoreView from "$lib/components/NetPromoterScoreView.svelte";
    import RedAmberGreenPicker from "$lib/components/RedAmberGreenPicker.svelte";
    import RedAmberGreenView from "$lib/components/RedAmberGreenView.svelte";
    import RedOrangeYellowGreenBluePicker from "$lib/components/RedOrangeYellowGreenBluePicker.svelte";
    import RedOrangeYellowGreenBlueView from "$lib/components/RedOrangeYellowGreenBlueView.svelte";
    import Form from "$lib/components/Form.svelte";
    import Field from "$lib/components/Field.svelte";
    import TextAreaInput from "$lib/components/TextAreaInput.svelte";
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";
    import Separator from "$lib/components/Separator.svelte";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import BackLink from "$lib/components/BackLink.svelte";

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
        <Card heading="Thank you for your feedback" headingLevel={2}>
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
        <Form label="Feedback form" onsubmit={handleSubmit}>
            <h2>Five-Star Rating</h2>
            <Card heading="Rate your experience" headingLevel={3}>
                <p>How would you rate the service overall?</p>
                <FiveStarRatingPicker
                    label="Service rating"
                    bind:value={starRating}
                />
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
            <Card heading="How did we do?" headingLevel={3}>
                <p>Select the face that best represents your experience.</p>
                <FiveFaceRatingPicker
                    label="Experience rating"
                    bind:value={faceRating}
                />
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
                <p>
                    On a scale of 0 to 10, how likely are you to recommend this
                    service?
                </p>
                <NetPromoterScorePicker
                    label="NPS rating"
                    bind:value={npsScore}
                />
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
            <Card heading="Project status" headingLevel={3}>
                <p>Select the current status of this project.</p>
                <RedAmberGreenPicker
                    label="Project RAG status"
                    bind:value={ragStatus}
                />
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
            <Card heading="Risk assessment" headingLevel={3}>
                <p>Select the risk level.</p>
                <RedOrangeYellowGreenBluePicker
                    label="Risk level"
                    bind:value={roygbStatus}
                />
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
