// Generated from shared/view-transition.ts by bin/sync-shared-modules; edit the shared module, never this copy.
// The theme-picker's optional viewTransition (spec/lessons/magicui item 4, tasks.md P32-T4). Pure and framework-neutral.
// The animation itself is the consumer's CSS (::view-transition-*); this only decides whether to ask for one. The Blazor
// picker has its own version in the script it runs.

/** True when the browser has the View Transition API and the user has not asked for reduced motion. */
export function canViewTransition()          {
    if (typeof document === "undefined") return false;
    if (
        typeof (document                                                ).startViewTransition !==
        "function"
    )
        return false;
    if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches)
        return false;
    return true;
}

/**
 * Runs `apply` inside `document.startViewTransition()` when `enabled` and the browser allows it (see canViewTransition),
 * else at once. Either way `apply` runs exactly once and makes the same change. `apply` may return a promise (for example
 * the new stylesheet loading), which the transition waits for, so the new snapshot shows the new theme.
 */
export function withViewTransition(enabled         , apply                            )       {
    if (!enabled || !canViewTransition()) {
        void apply();
        return;
    }
    (
        document

    ).startViewTransition(apply);
}

/**
 * Resolves when `link` has loaded or failed, or after `limit` milliseconds, whichever is first, so a transition never
 * waits long on a slow or missing stylesheet.
 */
export function linkSettled(link                 , limit = 1000)                {
    return new Promise((resolve) => {
        const done = () => resolve();
        link.addEventListener("load", done, { once: true });
        link.addEventListener("error", done, { once: true });
        setTimeout(done, limit);
    });
}
