/**
 * Barrel re-export for `<share-button>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"share-button"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./share-button` and call
 * `customElements.define(...)` themselves.
 */

import {
    ShareButton,
    canShareNatively,
    canCopy,
    nextShareButtonId,
    RIGHTWARDS_ARROW_WITH_HOOK,
} from "./share-button.js";
export {
    ShareButton,
    canShareNatively,
    canCopy,
    nextShareButtonId,
    RIGHTWARDS_ARROW_WITH_HOOK,
};
export type {
    ShareButtonProps,
    ShareButtonShareDetail,
    ShareButtonUrlDetail,
    ShareTarget,
    ShareStrategy,
} from "./share-button.js";

if (typeof customElements !== "undefined" && !customElements.get("share-button")) {
    customElements.define("share-button", ShareButton);
}
