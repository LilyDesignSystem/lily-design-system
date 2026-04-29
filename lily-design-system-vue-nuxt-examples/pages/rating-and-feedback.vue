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
            <Alert type="success" heading="Thank you!">
                Your feedback has been recorded.
            </Alert>
            <div>
                <p>Your product rating:</p>
                <FiveStarRatingView label="Your rating" :value="stars" />
            </div>
        </template>

        <template v-else>
            <h1>Feedback</h1>
            <Form label="Feedback form" @submit="handleSubmit">
                <h2>We value your feedback</h2>

                <section class="section">
                    <h3>Rate this product</h3>
                    <FiveStarRatingPicker label="Product rating" v-model="stars" />
                </section>

                <Separator />

                <section class="section">
                    <h3>How satisfied are you with our service?</h3>
                    <FiveFaceRatingPicker label="Service satisfaction" v-model="satisfaction" />
                </section>

                <Separator />

                <section class="section">
                    <h3>How likely are you to recommend us?</h3>
                    <NetPromoterScorePicker label="Recommendation likelihood" v-model="nps" />
                </section>

                <Separator />

                <section class="section">
                    <h3>Additional comments</h3>
                    <TextAreaInput label="Comments" v-model="comment" :rows="4" />
                </section>

                <Button type="submit">Submit Feedback</Button>
            </Form>
        </template>
    </main>
</template>
