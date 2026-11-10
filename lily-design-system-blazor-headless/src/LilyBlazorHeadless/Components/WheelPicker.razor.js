// WheelPicker.razor.js — what a Blazor event handler cannot do for the wheel picker (spec/detent-lessons, P26-T10):
// stop the page scrolling for the keys the wheel handles, keep the chosen option centred, tell .NET which way the text
// runs (so ArrowLeft and ArrowRight swap right-to-left), choose what the user scrolls to, and hear a form reset.
// Under static rendering nothing runs this; the component still renders and its keys still work.

import { isWheelRtl, watchWheelScroll, wheelMoveKey } from "../wheel-picker.js";

export function attach(list, dotnet, state) {
    let current = state;
    const options = () =>
        Array.from(list.querySelectorAll('[role="option"]'), (el) => ({
            value: el.getAttribute("data-value") ?? "",
            label: el.textContent ?? "",
            disabled: el.getAttribute("aria-disabled") === "true",
        }));
    const selected = () =>
        Array.from(list.querySelectorAll('[role="option"]')).findIndex(
            (el) => el.getAttribute("aria-selected") === "true",
        );
    // Only the list scrolls, never the page, and instantly. Moving by the distance between the two middles works on either
    // axis and right-to-left.
    const centre = () => {
        const option = list.querySelector('[role="option"][aria-selected="true"]');
        if (!option) return;
        const box = list.getBoundingClientRect();
        const row = option.getBoundingClientRect();
        if (current.orientation === "horizontal")
            list.scrollLeft += row.left + row.width / 2 - (box.left + box.width / 2);
        else list.scrollTop += row.top + row.height / 2 - (box.top + box.height / 2);
    };
    const onKeydown = (event) => {
        if (!current.disabled && wheelMoveKey(event.key, current.orientation, isWheelRtl(list)))
            event.preventDefault();
    };
    list.addEventListener("keydown", onKeydown);
    const stopScroll = watchWheelScroll(list, {
        options,
        selected,
        orientation: () => current.orientation,
        disabled: () => current.disabled,
        choose: (index) => dotnet.invokeMethodAsync("OnWheelChoose", index),
        recentre: centre,
    });
    // Form reset: one tick after `reset`, and not when it was cancelled. The hidden input's `form` follows a Form id.
    const hidden = list.parentElement?.querySelector('input[type="hidden"]');
    const form = hidden?.form ?? list.closest("form");
    let timer;
    const onReset = (event) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (!event.defaultPrevented) dotnet.invokeMethodAsync("OnWheelReset");
        }, 0);
    };
    form?.addEventListener("reset", onReset);
    dotnet.invokeMethodAsync("OnWheelDirection", isWheelRtl(list));
    centre();
    return {
        set(next) {
            current = next;
            centre();
        },
        dispose() {
            clearTimeout(timer);
            stopScroll();
            list.removeEventListener("keydown", onKeydown);
            form?.removeEventListener("reset", onReset);
        },
    };
}
