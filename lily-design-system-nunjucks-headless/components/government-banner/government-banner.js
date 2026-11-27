// government-banner.js — the behaviour of the GovernmentBanner macro: the toggle shows and hides the details (tasks.md P54-T1).

/** Wire one `.government-banner`. Returns a function that unwires it. */
export function initGovernmentBanner(root) {
    const button = root.querySelector(".government-banner-toggle");
    const id = button?.getAttribute("aria-controls");
    const details = id ? root.ownerDocument.getElementById(id) : null;
    if (!button || !details) return null;
    const onClick = () => {
        const open = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(open));
        details.hidden = !open;
    };
    button.addEventListener("click", onClick);
    return () => button.removeEventListener("click", onClick);
}

/** Wire every `.government-banner` on the page, once. */
export function autoInit(doc = document) {
    return [...doc.querySelectorAll(".government-banner")].map(initGovernmentBanner).filter(Boolean);
}
