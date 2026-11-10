// WheelPicker component
//
// A single-select listbox, vertical by default, where the selection follows the cursor: moving with the arrow keys, typing, or clicking
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
//   orientation — "vertical" | "horizontal", default "vertical". Horizontal moves with ArrowLeft / ArrowRight, swapped
//     right-to-left (the nearest `dir`).
//   name — string, optional. When set, a hidden input carries the value for a form. It is disabled, so not submitted,
//     while the picker is disabled, and a form reset puts the picker back to the value it was given first.
//   form — string, optional. The id of the form the hidden input belongs to, when the picker sits outside it.
//   ...restProps — spread onto the root <div>.
//
// Markup:
//   <div class="wheel-picker">
//     <div class="wheel-picker-list" role="listbox" aria-orientation tabindex="0" aria-activedescendant>
//       <div class="wheel-picker-option" role="option" aria-selected aria-disabled? data-value>…</div>
//     </div>
//     <input type="hidden" name value form? disabled?>   (only with `name`)
//   </div>
//
// Keyboard (APG listbox, selection follows focus): ArrowDown / ArrowUp (ArrowRight / ArrowLeft when horizontal), Home / End, PageDown / PageUp, type-ahead over the
// labels. Disabled options are skipped.

import React, { useEffect, useId, useRef } from "react";
import {
    isWheelRtl,
    isWheelTypeaheadKey,
    nextWheelIndex,
    nextWheelPrefix,
    wheelMoveKey,
    wheelTypeaheadIndex,
    type WheelOption,
    type WheelOrientation,
    type WheelTypeahead,
} from "./wheel-picker";
import { warnMissingName } from "./dev-warning";

export type { WheelOption, WheelOrientation };

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
    /** The axis the options run along. Default "vertical". */
    orientation?: WheelOrientation;
    /** Form field name for a hidden input. */
    name?: string;
    /** The id of the form the hidden input belongs to, when the picker is outside it. */
    form?: string;
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
    orientation = "vertical",
    name,
    form,
    ...restProps
}: WheelPickerProps) {
    warnMissingName("WheelPicker", label, restProps["aria-label"], restProps["aria-labelledby"]);
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
        const move = wheelMoveKey(
            event.key,
            orientation,
            list.current ? isWheelRtl(list.current) : false,
        );
        if (move) {
            event.preventDefault();
            select(nextWheelIndex(options, selectedIndex, move, { loop, pageSize }));
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
        // Move by the distance between the two middles: it works on either axis and in right-to-left.
        const box = el.getBoundingClientRect();
        const row = option.getBoundingClientRect();
        if (orientation === "horizontal")
            el.scrollLeft += row.left + row.width / 2 - (box.left + box.width / 2);
        else el.scrollTop += row.top + row.height / 2 - (box.top + box.height / 2);
    }, [selectedIndex, orientation]);

    // Form reset: a hidden input keeps its value through a reset, so put the picker back to the value it was given first,
    // through onChange (the consumer holds the value): one tick after `reset`, and not when the reset was cancelled.
    const initialValue = useRef(value);
    const latest = useRef({ value, onChange });
    latest.current = { value, onChange };
    useEffect(() => {
        const owner = form ? document.getElementById(form) : list.current?.closest("form");
        if (!owner) return;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const onReset = (event: Event) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const { value: now, onChange: report } = latest.current;
                if (!event.defaultPrevented && now !== initialValue.current)
                    report?.(initialValue.current);
            }, 0);
        };
        owner.addEventListener("reset", onReset);
        return () => {
            clearTimeout(timer);
            owner.removeEventListener("reset", onReset);
        };
    }, [form]);

    return (
        <div
            className={`wheel-picker ${className}`}
            {...restProps}
        >
            <div
                ref={list}
                className="wheel-picker-list"
                role="listbox"
                aria-label={label}
                aria-orientation={orientation}
                aria-disabled={disabled ? "true" : undefined}
                aria-activedescendant={
                    selectedIndex >= 0 ? `${uid}-option-${selectedIndex}` : undefined
                }
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
            {name ? (
                <input
                    type="hidden"
                    name={name}
                    value={value}
                    form={form}
                    disabled={disabled}
                    readOnly
                />
            ) : null}
        </div>
    );
}
