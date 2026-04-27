<script setup lang="ts">

    // DatetimeView component
    //
    // A headless read-only display of an ISO 8601 datetime value rendered as a
    // semantic <time> element. The datetime attribute carries the machine-readable
    // value while consumer-supplied display text or default slot content provides
    // the human-readable representation. The component does NOT format the
    // datetime — the consumer formats and localizes the display text.
    //
    // Props:
    //   value — string, required. ISO 8601 datetime value used for the
    //           datetime attribute.
    //   format — string, optional. Pre-formatted display text. Falls back to
    //            value when no slot or format is supplied.
    //   label — string, optional. aria-label override.
    //   default slot. Optional content overriding format.
    //   ...restProps — additional HTML attributes spread onto <time>.
    //
    // Syntax:
    //   <DatetimeView value="2026-04-27T10:00" format="April 27, 2026" />
    //
    // Examples:
    //   <!-- With consumer-formatted display text -->
    //   <DatetimeView value="2026-04-27T10:00:00Z" format="Apr 27, 2026" />
    //
    //   <!-- With default slot content -->
    //   <DatetimeView value="2026-04-27T10:00:00Z">
    //     <strong>Today</strong>
    //   </DatetimeView>
    //
    //   <!-- Falling back to value when no format/slot is given -->
    //   <DatetimeView value="2026-04-27T10:00:00Z" />
    //
    // Keyboard: None — passive read-only view.
    //
    // Accessibility:
    //   - <time datetime={value}> provides machine-readable semantics
    //   - aria-label optional
    //
    // Internationalization:
    //   - Component does not localize; consumer supplies pre-formatted text
    //
    // Claude rules:
    //   - Headless: no CSS or styles
    //
    // References:
    //   - HTML <time> element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time

    withDefaults(defineProps<{
        /** ISO 8601 datetime value. */
        value: string;
        /** Pre-formatted display text. */
        format?: string;
        /** aria-label override. */
        label?: string;
    }>(), {
        format: undefined,
        label: undefined,
    });

</script>

<template>
    <!-- DatetimeView.vue -->
    <time
        class="datetime-view"
        :datetime="value"
        :aria-label="label"
    >
        <slot>{{ format ?? value }}</slot>
    </time>
</template>
