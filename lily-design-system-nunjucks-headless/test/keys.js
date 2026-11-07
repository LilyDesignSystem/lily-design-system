// A key press in jsdom, through the listeners a macro's script attached. `on(el).press("ArrowRight", { shiftKey: true })`
// returns the event, so a test can read defaultPrevented.

export function on(el) {
    return {
        press(key, init = {}) {
            el.focus?.();
            const { KeyboardEvent } = el.ownerDocument.defaultView;
            const event = new KeyboardEvent("keydown", {
                key,
                bubbles: true,
                cancelable: true,
                ...init,
            });
            el.dispatchEvent(event);
            return event;
        },
    };
}
