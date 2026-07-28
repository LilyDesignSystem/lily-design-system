/**
 * Barrel re-export for `<date-time-picker>`.
 *
 * Importing this module registers the custom element under the tag name
 * `"date-time-picker"`. Registration is idempotent — re-imports do not
 * throw. Consumers who want a different tag name can import the class
 * directly from `./date-time-picker` and call `customElements.define(...)`
 * themselves.
 */

import {
    DateTimePicker,
    CALENDAR,
    pad,
    daysInMonth,
    formatIsoDate,
    parseIsoDate,
    toEpochDay,
    fromEpochDay,
    addDays,
    addMonths,
    weekdayOf,
    isoWeek,
    parseIsoTime,
    formatIsoTime,
    splitValue,
    joinValue,
    withinRange,
    firstDayOfWeekFor,
    monthMatrix,
    monthNames,
    numericFieldOrder,
    parseDateInput,
    parseTimeInput,
    nextDateTimePickerId,
} from "./date-time-picker.js";

export {
    DateTimePicker,
    CALENDAR,
    pad,
    daysInMonth,
    formatIsoDate,
    parseIsoDate,
    toEpochDay,
    fromEpochDay,
    addDays,
    addMonths,
    weekdayOf,
    isoWeek,
    parseIsoTime,
    formatIsoTime,
    splitValue,
    joinValue,
    withinRange,
    firstDayOfWeekFor,
    monthMatrix,
    monthNames,
    numericFieldOrder,
    parseDateInput,
    parseTimeInput,
    nextDateTimePickerId,
};

export type {
    DateTimePickerProps,
    DateTimePickerLabels,
    DateTimePickerChangeDetail,
    DateTimePickerShortcutDetail,
    DateTimePickerInvalidDetail,
    DateTimeMode,
    DateTimeShortcut,
    CivilDate,
    CivilTime,
} from "./date-time-picker.js";

if (typeof customElements !== "undefined" && !customElements.get("date-time-picker")) {
    customElements.define("date-time-picker", DateTimePicker);
}
