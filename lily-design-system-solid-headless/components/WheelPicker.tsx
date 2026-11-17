// WheelPicker component
//
// A single-select listbox, vertical by default, where the selection follows the cursor: moving with the arrow keys, typing, or clicking
// an option chooses it. Use it to pick one of a short list (hours, minutes, months, years) in the manner of a scroll wheel.
// The component owns the roles and the keys; the wheel LOOK (scroll snapping, fading, 3-D) is the consumer's CSS.
//
// Controlled: the consumer holds `value` and updates it in `onChange`.
//
// Props:
//   class — string, optional. Consumer class appended after the base class.
//   label — string, required. Accessible name of the listbox.
//   options — { value: string; label: string; disabled?: boolean }[], required.
//   value — string. The selected option's value; "" or an unknown value selects nothing.
//   onChange — (value: string) => void. Called once when the selection changes: by a key, a click, or the user scrolling
//     the wheel, once it settles (never for each option it passes).
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
// labels. Disabled options are skipped. Scrolling: when the user turns the wheel and it settles, the enabled option nearest the
// middle is chosen; the component's own centring chooses nothing.

import { omit, createEffect, createUniqueId, onSettled, untrack } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import {
    isWheelRtl,
    isWheelTypeaheadKey,
    nextWheelIndex,
    nextWheelPrefix,
    watchWheelScroll,
    wheelMoveKey,
    wheelTypeaheadIndex,
    type WheelOption,
    type WheelOrientation,
    type WheelTypeahead,
} from "./wheel-picker";
import { warnMissingName } from "./dev-warning";

export type { WheelOption, WheelOrientation };

export interface WheelPickerProps {
    class?: string;
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

export default function WheelPicker(props: WheelPickerProps) {
    const p = withDefaults(
        {
            class: "" as const,
            value: "" as const,
            loop: false,
            pageSize: 5,
            disabled: false,
            orientation: "vertical" as const,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "options",
        "value",
        "onChange",
        "loop",
        "pageSize",
        "disabled",
        "orientation",
        "name",
        "form",
    );
    warnMissingName("WheelPicker", p.label, p["aria-label"], p["aria-labelledby"]);
    const uid = createUniqueId();
    const list: { current: HTMLDivElement | null } = { current: null };
    const typeahead: { current: WheelTypeahead } = { current: { prefix: "", at: 0 } };
    const selectedIndex = () => p.options.findIndex((o) => o.value === p.value);

    const select = (index: number): void => {
        if (index < 0) return;
        const next = p.options[index].value;
        if (next === p.value) return; // applying the selection already held is a no-op
        p.onChange?.(next);
    };

    const onKeyDown = (event: KeyboardEvent): void => {
        if (p.disabled) return;
        const move = wheelMoveKey(
            event.key,
            p.orientation,
            list.current ? isWheelRtl(list.current) : false,
        );
        if (move) {
            event.preventDefault();
            select(
                nextWheelIndex(p.options, selectedIndex(), move, {
                    loop: p.loop,
                    pageSize: p.pageSize,
                }),
            );
        } else if (isWheelTypeaheadKey(event)) {
            typeahead.current = nextWheelPrefix(typeahead.current, event.key, Date.now());
            select(wheelTypeaheadIndex(p.options, selectedIndex(), typeahead.current.prefix));
        }
    };

    const onClick = (event: MouseEvent): void => {
        if (p.disabled) return;
        const target = (event.target as Element).closest<HTMLElement>('[role="option"]');
        if (!target || target.getAttribute("aria-disabled") === "true") return;
        select(Number(target.getAttribute("data-index")));
        list.current?.focus();
    };

    // Keep the selected option centred in the list. Only the list scrolls (never the page), and instantly: no animation.
    const centre = (): void => {
        const el = list.current;
        if (!el || selectedIndex() < 0) return;
        const option = el.querySelector<HTMLElement>(`[data-index="${selectedIndex()}"]`);
        if (!option) return;
        // Move by the distance between the two middles: it works on either axis and in right-to-left.
        const box = el.getBoundingClientRect();
        const row = option.getBoundingClientRect();
        if (p.orientation === "horizontal")
            el.scrollLeft += row.left + row.width / 2 - (box.left + box.width / 2);
        else el.scrollTop += row.top + row.height / 2 - (box.top + box.height / 2);
    };
    createEffect(
        () => [selectedIndex(), p.orientation],
        () => untrack(centre),
    );

    // Scrolling chooses: when the user turns the wheel and it settles, the option in the middle becomes the p.value. The watch
    // reads the latest render through a ref, so it is set up once.
    // The latest props and state, read live (a Solid component body runs once).
    const current = {
        get current() {
            return {
                options: p.options,
                selectedIndex: selectedIndex(),
                orientation: p.orientation,
                disabled: p.disabled,
                select,
                centre,
            };
        },
    };
    onSettled(() =>
        untrack(() => {
            if (!list.current) return;
            return watchWheelScroll(list.current, {
                options: () => current.current.options,
                selected: () => current.current.selectedIndex,
                orientation: () => current.current.orientation,
                disabled: () => current.current.disabled,
                choose: (index) => current.current.select(index),
                recentre: () => current.current.centre(),
            });
        }),
    );

    // Form reset: a hidden input keeps its p.value through a reset, so put the picker back to the p.value it was given first,
    // through p.onChange (the consumer holds the p.value): one tick after `reset`, and not when the reset was cancelled.
    const initialValue = { current: p.value };
    const latest = {
        get current() {
            return { value: p.value, onChange: p.onChange };
        },
    };
    createEffect(
        () => [p.form],
        () =>
            untrack(() => {
                const owner = p.form
                    ? document.getElementById(p.form)
                    : list.current?.closest("form");
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
            }),
    );

    return (
        <div
            class={`wheel-picker ${p.class}`}
            {...restProps}
        >
            <div
                ref={(el) => (list.current = el)}
                class="wheel-picker-list"
                role="listbox"
                aria-label={p.label}
                aria-orientation={attr(p.orientation)}
                aria-disabled={attr(p.disabled ? "true" : undefined)}
                aria-activedescendant={
                    selectedIndex() >= 0 ? `${uid}-option-${selectedIndex()}` : undefined
                }
                tabindex={p.disabled ? -1 : 0}
                onKeyDown={onKeyDown}
                onClick={onClick}
            >
                {p.options.map((option, index) => (
                    <div
                        class="wheel-picker-option"
                        role="option"
                        id={`${uid}-option-${index}`}
                        aria-selected={attr(index === selectedIndex())}
                        aria-disabled={attr(option.disabled ? "true" : undefined)}
                        data-value={attr(option.value)}
                        data-index={attr(index)}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
            {p.name ? (
                <input
                    type="hidden"
                    name={p.name}
                    value={p.value}
                    form={p.form}
                    disabled={p.disabled}
                    readonly
                />
            ) : null}
        </div>
    );
}
