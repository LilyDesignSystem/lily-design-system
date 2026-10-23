// WheelPicker component
//
// A vertical single-select listbox where the selection follows the cursor: moving with the arrow keys, typing, or clicking
// an option chooses it. Use it to pick one of a short list (hours, minutes, months, years) in the manner of a scroll wheel.
// The component owns the roles and the keys; the wheel LOOK (scroll snapping, fading, 3-D) is the consumer's CSS.
//
// Controlled: the consumer holds `value` and updates it in `onChange`.
//
// Props:
//   className — string, optional. Consumer class appended after the base class.
//   label — string, required. Accessible name of the listbox.
//   options — { value: string; label: string; disabled?: boolean }[], required.
//   value — string. The selected option's value; "" or an unknown value selects nothing.
//   onChange — (value: string) => void. Called once when the selection changes.
//   loop — boolean, default false. Arrow keys wrap from the last enabled option to the first and back.
//   pageSize — number, default 5. Enabled options PageUp / PageDown move by.
//   disabled — boolean, default false. Ignores keys and clicks; not focusable.
//   name — string, optional. When set, a hidden input carries the value for a form.
//   ...restProps — spread onto the root <div>.
//
// Markup:
//   <div class="wheel-picker">
//     <div class="wheel-picker-list" role="listbox" aria-orientation="vertical" tabindex="0" aria-activedescendant>
//       <div class="wheel-picker-option" role="option" aria-selected aria-disabled? data-value>…</div>
//     </div>
//     <input type="hidden" name value>   (only with `name`)
//   </div>
//
// Keyboard (APG listbox, selection follows focus): ArrowDown / ArrowUp, Home / End, PageDown / PageUp, type-ahead over the
// labels. Disabled options are skipped.

import React, { useEffect, useId, useRef } from "react";
import {
    isWheelTypeaheadKey,
    nextWheelIndex,
    nextWheelPrefix,
    WHEEL_MOVE_KEYS,
    wheelTypeaheadIndex,
    type WheelMoveKey,
    type WheelOption,
    type WheelTypeahead,
} from "./wheel-picker";

export type { WheelOption };

export interface WheelPickerProps {
    className?: string;
    /** Accessible name. */
    label: string;
    /** The choices. */
    options: WheelOption[];
    /** The selected option's value. */
    value?: string;
    /** Called once when the selection changes. */
    onChange?: (value: string) => void;
    /** Arrow keys wrap at the ends. */
    loop?: boolean;
    /** Enabled options PageUp / PageDown move by. */
    pageSize?: number;
    /** Ignores keys and clicks. */
    disabled?: boolean;
    /** Form field name for a hidden input. */
    name?: string;
    [key: string]: unknown;
}

export default function WheelPicker({
    className = "",
    label,
    options,
    value = "",
    onChange,
    loop = false,
    pageSize = 5,
    disabled = false,
    name,
    ...restProps
}: WheelPickerProps) {
    const uid = useId();
    const list = useRef<HTMLDivElement>(null);
    const typeahead = useRef<WheelTypeahead>({ prefix: "", at: 0 });
    const selectedIndex = options.findIndex((o) => o.value === value);

    const select = (index: number): void => {
        if (index < 0) return;
        const next = options[index].value;
        if (next === value) return; // applying the selection already held is a no-op
        onChange?.(next);
    };

    const onKeyDown = (event: React.KeyboardEvent): void => {
        if (disabled) return;
        if (WHEEL_MOVE_KEYS.includes(event.key)) {
            event.preventDefault();
            select(nextWheelIndex(options, selectedIndex, event.key as WheelMoveKey, { loop, pageSize }));
        } else if (isWheelTypeaheadKey(event)) {
            typeahead.current = nextWheelPrefix(typeahead.current, event.key, Date.now());
            select(wheelTypeaheadIndex(options, selectedIndex, typeahead.current.prefix));
        }
    };

    const onClick = (event: React.MouseEvent): void => {
        if (disabled) return;
        const target = (event.target as Element).closest<HTMLElement>('[role="option"]');
        if (!target || target.getAttribute("aria-disabled") === "true") return;
        select(Number(target.getAttribute("data-index")));
        list.current?.focus();
    };

    // Keep the selected option centred in the list. Only the list scrolls (never the page), and instantly: no animation.
    useEffect(() => {
        const el = list.current;
        if (!el || selectedIndex < 0) return;
        const option = el.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
        if (!option) return;
        el.scrollTop = option.offsetTop - (el.clientHeight - option.offsetHeight) / 2;
    }, [selectedIndex]);

    return (
        <div className={`wheel-picker ${className}`} {...restProps}>
            <div
                ref={list}
                className="wheel-picker-list"
                role="listbox"
                aria-label={label}
                aria-orientation="vertical"
                aria-disabled={disabled ? "true" : undefined}
                aria-activedescendant={selectedIndex >= 0 ? `${uid}-option-${selectedIndex}` : undefined}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={onKeyDown}
                onClick={onClick}
            >
                {options.map((option, index) => (
                    <div
                        key={option.value}
                        className="wheel-picker-option"
                        role="option"
                        id={`${uid}-option-${index}`}
                        aria-selected={index === selectedIndex}
                        aria-disabled={option.disabled ? "true" : undefined}
                        data-value={option.value}
                        data-index={index}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
            {name ? <input type="hidden" name={name} value={value} readOnly /> : null}
        </div>
    );
}
