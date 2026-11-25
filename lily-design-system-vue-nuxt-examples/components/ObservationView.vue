<script setup lang="ts">
// ObservationView: a read-only clinical observation or result, with unit, flag and reference range (spec/healthcare-ui
// item 1). Shows what the consumer decided; computes no flag and no range. Props and rules: ObservationView.md.
import { computed } from "vue";
import { hasWords } from "./clinical-format";
import { warnMissingProp } from "./dev-warning";

// FHIR statuses with no value to show: the consumer's words replace it (tasks.md P28-T5).
const MISSING: readonly string[] = [
    "registered",
    "cancelled",
    "masked",
    "not-recorded",
    "unavailable",
    "not-applicable",
];

const props = withDefaults(
    defineProps<
        {
            /** Hidden text naming the observation. */
            label?: string;
            value?: string;
            unit?: string;
            /** A FHIR v3 ObservationInterpretation code, rendered as data-interpretation. */
            interpretation?: string;
            /** The consumer's words for the flag; required when it is not normal. */
            flagLabel?: string;
            range?: string;
            /** Further named ranges, each its own -range part with a -range-label. */
            ranges?: { label: string; text: string }[];
            /** With meterValue, meterMin and meterMax, a native <meter> shows where the value sits; aria-hidden, as the words say it. */
            meterValue?: number;
            meterMin?: number;
            meterMax?: number;
            /** The reference range and best value on the meter, for the theme. */
            meterLow?: number;
            meterHigh?: number;
            meterOptimum?: number;
            /** A superseded value, shown in a <del>. */
            previousValue?: string;
            /** The consumer's words for it; required with previousValue. */
            previousLabel?: string;
            /** For an authorised history view: an entered-in-error result's former value, struck through after its words. */
            showWithdrawn?: boolean;
        } & (
            | { status?: "final"; statusLabel?: string }
            | {
                  status:
                      | "registered"
                      | "preliminary"
                      | "amended"
                      | "corrected"
                      | "entered-in-error"
                      | "cancelled"
                      | "unknown"
                      | "masked"
                      | "not-recorded"
                      | "unavailable"
                      | "not-applicable";
                  /** The consumer's words, required for any status but final: without them no value, flag, range or meter is shown. */
                  statusLabel: string;
              }
        )
    >(),
    { value: "", status: "final", showWithdrawn: false },
);

if (props.status !== "final")
    warnMissingProp(
        "ObservationView",
        "statusLabel",
        props.statusLabel,
        "A result that is not final must say so in words; without them its value is not shown.",
    );
if (props.previousValue)
    warnMissingProp(
        "ObservationView",
        "previousLabel",
        props.previousLabel,
        "a superseded value needs words saying it changed, since a screen reader may not announce <del>.",
    );
if (props.interpretation && props.interpretation !== "N")
    warnMissingProp(
        "ObservationView",
        "flagLabel",
        props.flagLabel,
        "An abnormal flag needs words, not colour alone (WCAG 1.4.1).",
    );

const current = computed(() => props.status ?? "final");
const withdrawn = computed(() => current.value === "entered-in-error");
const withheld = computed(
    () =>
        MISSING.includes(current.value) ||
        (current.value !== "final" && !hasWords(props.statusLabel)) ||
        (withdrawn.value && !props.showWithdrawn),
);
</script>

<template>
    <!-- ObservationView.vue -->
    <span
        class="observation-view"
        :data-interpretation="withheld || withdrawn ? undefined : interpretation || undefined"
        :data-status="status"
        ><span
            v-if="label"
            class="screen-reader-span"
            >{{ `${label} ` }}</span
        ><span
            v-if="withheld"
            class="observation-view-status"
            >{{ statusLabel }}</span
        ><template v-else-if="withdrawn"
            ><span class="observation-view-status">{{ statusLabel }}</span
            >{{ " "
            }}<del class="observation-view-withdrawn-value"
                ><span class="observation-view-value">{{ value }}</span
                ><template v-if="unit"
                    >{{ " " }}<span class="observation-view-unit">{{ unit }}</span></template
                ></del
            ></template
        ><template v-else
            ><span class="observation-view-value">{{ value }}</span
            ><template v-if="unit"
                >{{ " " }}<span class="observation-view-unit">{{ unit }}</span></template
            ><template v-if="flagLabel"
                >{{ " " }}<span class="observation-view-flag">{{ flagLabel }}</span></template
            ><template v-if="range"
                >{{ " " }}<span class="observation-view-range">{{ range }}</span></template
            ><template
                v-for="named in ranges ?? []"
                :key="named.label"
                >{{ " "
                }}<span class="observation-view-range"
                    ><span class="observation-view-range-label">{{ named.label }}</span
                    >{{ " " }}{{ named.text }}</span
                ></template
            ><template
                v-if="
                    typeof meterValue === 'number' &&
                    typeof meterMin === 'number' &&
                    typeof meterMax === 'number'
                "
                >{{ " "
                }}<meter
                    class="observation-view-meter"
                    aria-hidden="true"
                    :value="meterValue"
                    :min="meterMin"
                    :max="meterMax"
                    :low="meterLow"
                    :high="meterHigh"
                    :optimum="meterOptimum"
                ></meter></template
            ><template v-if="previousValue"
                >{{ " " }}<del class="observation-view-previous-value">{{ previousValue }}</del
                ><template v-if="previousLabel"
                    >{{ " "
                    }}<span class="observation-view-previous-label">{{
                        previousLabel
                    }}</span></template
                ></template
            ><template v-if="(status ?? 'final') !== 'final' && statusLabel"
                >{{ " " }}<span class="observation-view-status">{{ statusLabel }}</span></template
            ></template
        ></span
    >
</template>
