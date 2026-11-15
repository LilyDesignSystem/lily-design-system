<script setup lang="ts">
import { ref } from "vue";

const stars = ref(0);
const satisfaction = ref(0);
const nps = ref(0);
const comment = ref("");
const submitted = ref(false);

function handleSubmit() {
    submitted.value = true;
}
</script>

<template>
    <main class="page-wrapper">
        <template v-if="submitted">
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
                    :value="stars"
                />
            </div>
        </template>

        <template v-else>
            <h1>Feedback</h1>
            <Form
                label="Feedback form"
                @submit="handleSubmit"
            >
                <h2>We value your feedback</h2>

                <section class="section">
                    <h3>Rate this product</h3>
                    <FiveStarRatingRadioGroup label="Product rating">
                        <label
                            v-for="[value, text] in [
                                ['1', '1 star'],
                                ['2', '2 stars'],
                                ['3', '3 stars'],
                                ['4', '4 stars'],
                                ['5', '5 stars'],
                            ]"
                            :key="value"
                        >
                            <FiveStarRatingRadioInput
                                :label="text"
                                name="stars"
                                :value="value"
                                :checked="stars === Number(value)"
                                @change="stars = Number(value)"
                            />
                            {{ text }}
                        </label>
                    </FiveStarRatingRadioGroup>
                </section>

                <Separator />

                <section class="section">
                    <h3>How satisfied are you with our service?</h3>
                    <FiveFaceRatingRadioGroup label="Service satisfaction">
                        <label
                            v-for="[value, text] in [
                                ['1', 'Very dissatisfied'],
                                ['2', 'Dissatisfied'],
                                ['3', 'Neutral'],
                                ['4', 'Satisfied'],
                                ['5', 'Very satisfied'],
                            ]"
                            :key="value"
                        >
                            <FiveFaceRatingRadioInput
                                :label="text"
                                name="satisfaction"
                                :value="value"
                                :checked="satisfaction === Number(value)"
                                @change="satisfaction = Number(value)"
                            />
                            {{ text }}
                        </label>
                    </FiveFaceRatingRadioGroup>
                </section>

                <Separator />

                <section class="section">
                    <h3>How likely are you to recommend us?</h3>
                    <NetPromoterScoreRadioGroup label="Recommendation likelihood">
                        <label
                            v-for="[value, text] in [
                                ['0', '0'],
                                ['1', '1'],
                                ['2', '2'],
                                ['3', '3'],
                                ['4', '4'],
                                ['5', '5'],
                                ['6', '6'],
                                ['7', '7'],
                                ['8', '8'],
                                ['9', '9'],
                                ['10', '10'],
                            ]"
                            :key="value"
                        >
                            <NetPromoterScoreRadioInput
                                :label="text"
                                name="nps"
                                :value="value"
                                :checked="nps === Number(value)"
                                @change="nps = Number(value)"
                            />
                            {{ text }}
                        </label>
                    </NetPromoterScoreRadioGroup>
                </section>

                <Separator />

                <section class="section">
                    <h3>Additional comments</h3>
                    <TextAreaInput
                        label="Comments"
                        v-model="comment"
                        :rows="4"
                    />
                </section>

                <Button type="submit">Submit Feedback</Button>
            </Form>
        </template>
    </main>
</template>
