// hamburger-menu.js — the behaviour of the HamburgerMenu macro: the button shows and hides the navigation.

/** Wire one `.hamburger-menu`. Returns a function that unwires it. */
export function initHamburgerMenu(root) {
    const button = root.querySelector(".hamburger-menu-button");
    const nav = root.querySelector(".hamburger-menu-nav");
    if (!button || !nav) return null;
    const onClick = () => {
        const open = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(open));
        nav.hidden = !open;
    };
    button.addEventListener("click", onClick);
    return () => button.removeEventListener("click", onClick);
}

/** Wire every `.hamburger-menu` on the page, once. */
export function autoInit(doc = document) {
    return [...doc.querySelectorAll(".hamburger-menu")].map(initHamburgerMenu).filter(Boolean);
}
