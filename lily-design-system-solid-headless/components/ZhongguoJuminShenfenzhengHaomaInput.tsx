// ZhongguoJuminShenfenzhengHaomaInput component
//
// A headless input for entering China's Resident Identity Card Number (居民身份证号码).
// Format: Eighteen characters under national standard GB 11643. The first six digits encode the region of registration; the next eight encode date of birth (YYYYMMDD); the next three are a sequence number whose last digit's parity encodes sex (odd male, even female); the eighteenth character is a check character computed with the ISO 7064:1983 MOD 11-2 algorithm over the first seventeen digits -- a value of 10 is written as the letter X.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible label for screen readers via aria-label.
//   value — string, default "". Bindable input value; supports value + onChange.
//   required — boolean, default false. Whether the input is required for form submission.
//   disabled — boolean, default false. Whether the input is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <ZhongguoJuminShenfenzhengHaomaInput label="Resident Identity Card Number (居民身份证号码)" value={value} onChange={setValue} />
//
// Accessibility:
//   - aria-label provides the accessible name for screen readers
//   - autoComplete="off" protects sensitive identifiers
//   - required and disabled states are conveyed to assistive technology
//
// References:
//   - https://en.wikipedia.org/wiki/Resident_Identity_Card

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";

export interface ZhongguoJuminShenfenzhengHaomaInputProps {
    class?: string;
    /** Accessible label for screen readers */
    label: string;
    /** The current value of the input, bindable */
    value?: string;
    /** Whether the input is required for form submission */
    required?: boolean;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Callback when value changes. */
    onChange?: (value: string) => void;
    [key: string]: unknown;
}

export default function ZhongguoJuminShenfenzhengHaomaInput(
    props: ZhongguoJuminShenfenzhengHaomaInputProps,
) {
    const p = withDefaults(
        { class: "" as const, value: "" as const, required: false, disabled: false },
        props,
    );
    const restProps = omit(p, "class", "label", "value", "required", "disabled", "onChange");
    warnMissingName(
        "ZhongguoJuminShenfenzhengHaomaInput",
        p.label,
        p["aria-label"],
        p["aria-labelledby"],
    );
    return (
        <input
            class={`zhongguo-jumin-shenfenzheng-haoma-input ${p.class}`}
            type="text"
            aria-label={p.label}
            autocomplete="off"
            spellcheck="false"
            value={p.value}
            onInput={(e) => p.onChange?.(e.currentTarget.value)}
            required={p.required}
            disabled={p.disabled}
            {...restProps}
        />
    );
}
