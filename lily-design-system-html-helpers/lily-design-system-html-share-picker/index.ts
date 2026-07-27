/**
 * Barrel re-export for `<share-chooser>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"share-chooser"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./share-chooser` and call
 * `customElements.define(...)` themselves.
 */

import {
    ShareChooser,
    canShareNatively,
    canCopy,
    nextShareChooserId,
    BLACK_RIGHTWARDS_ARROWHEAD,
} from "./share-chooser.js";
export {
    ShareChooser,
    canShareNatively,
    canCopy,
    nextShareChooserId,
    BLACK_RIGHTWARDS_ARROWHEAD,
};
export type {
    ShareChooserProps,
    ShareChooserShareDetail,
    ShareChooserUrlDetail,
    ShareTarget,
    ShareStrategy,
} from "./share-chooser.js";

if (typeof customElements !== "undefined" && !customElements.get("share-chooser")) {
    customElements.define("share-chooser", ShareChooser);
}
