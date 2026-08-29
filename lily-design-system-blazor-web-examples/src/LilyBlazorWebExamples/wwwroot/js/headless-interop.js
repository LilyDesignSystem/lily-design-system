// Roving tabindex keyboard navigation for TabBar, MenuBar, ToolBar
window.headlessInterop = {
    initRovingTabindex: function (containerEl) {
        if (!containerEl) return;
        const buttons = containerEl.querySelectorAll('[role="tab"], [role="menuitem"], button');
        if (buttons.length === 0) return;

        containerEl.addEventListener('keydown', function (e) {
            const items = Array.from(containerEl.querySelectorAll('[role="tab"], [role="menuitem"], button'));
            const current = items.indexOf(document.activeElement);
            if (current === -1) return;

            let next = -1;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                next = (current + 1) % items.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                next = (current - 1 + items.length) % items.length;
            } else if (e.key === 'Home') {
                next = 0;
            } else if (e.key === 'End') {
                next = items.length - 1;
            }

            if (next !== -1) {
                e.preventDefault();
                items.forEach(item => item.setAttribute('tabindex', '-1'));
                items[next].setAttribute('tabindex', '0');
                items[next].focus();
            }
        });
    },

    // Single-page wizard focus management (book-an-appointment, plan
    // P6-T3). Looks the target up by id at call time rather than caching
    // an ElementReference, so a step transition that swaps the underlying
    // DOM node (a new heading, a new error summary) is always focused
    // correctly instead of risking a stale reference.
    focusById: function (id) {
        var el = document.getElementById(id);
        if (el) el.focus();
    }
};
