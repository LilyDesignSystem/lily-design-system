<script setup lang="ts">

    // CurrencyInput component
    //
    // A locale-aware currency input rendered as <input type="text"
    // inputmode="decimal">. The component does not format the displayed
    // value itself — formatting (Intl.NumberFormat, separators, currency
    // symbol placement) is the consumer's responsibility because
    // formatting rules vary by locale and design context. The
    // currencyCode prop is exposed via data-currency-code so consumers
    // can pass it to Intl.NumberFormat.
    //
    // Props:
    //   label        — string, required. Accessible name via aria-label.
    //   modelValue   — number | undefined. Current numeric value (v-model).
    //   currencyCode — string, default "USD". ISO 4217 currency code.
    //   min, max     — number, optional. Constraints; not enforced clamping.
    //   required     — boolean, default false.
    //   disabled     — boolean, default false.
    //
    // Emits:
    //   update:modelValue — fires with the parsed number, or undefined if
    //                       the input is empty / non-numeric.
    //
    // Accessibility:
    //   - aria-label provides the accessible name
    //   - inputmode="decimal" triggers numeric keypad on mobile
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - No locale formatting baked in — consumer chooses how to display

    withDefaults(defineProps<{
        /** Accessible name via aria-label. */
        label: string;
        /** Current numeric value (v-model). */
        modelValue?: number;
        /** ISO 4217 currency code. */
        currencyCode?: string;
        /** Minimum allowed value. */
        min?: number;
        /** Maximum allowed value. */
        max?: number;
        /** Whether the input is required. */
        required?: boolean;
        /** Whether the input is disabled. */
        disabled?: boolean;
    }>(), {
        modelValue: undefined,
        currencyCode: "USD",
        required: false,
        disabled: false,
    });

    const emit = defineEmits<{
        (e: "update:modelValue", value: number | undefined): void;
    }>();

    function onInput(event: Event) {
        const raw = (event.target as HTMLInputElement).value.trim();
        if (raw === "") {
            emit("update:modelValue", undefined);
            return;
        }
        const parsed = Number(raw);
        emit("update:modelValue", Number.isNaN(parsed) ? undefined : parsed);
    }

</script>

<template>
    <!-- CurrencyInput.vue -->
    <input
        type="text"
        inputmode="decimal"
        class="currency-input"
        :aria-label="label"
        :data-currency-code="currencyCode"
        :value="modelValue === undefined ? '' : String(modelValue)"
        :min="min"
        :max="max"
        :required="required"
        :disabled="disabled"
        @input="onInput"
    />
</template>
