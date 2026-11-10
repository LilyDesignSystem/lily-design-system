// widget-init.js — the keys for every macro that is markup only, except those with a client of their own (tab-bar,
// menu, menu-bar, tree-list, combobox, command, autosuggest, tag-input-div). Load it once:
//
//   import { autoInit } from "@lilydesignsystem/nunjucks-headless/components/widget-init.js";
//   autoInit();
//
// widget-keys.js is generated from shared/widget-keys.ts, and macro-keys.js holds the rest. A root inside
// [data-consumer-keys] is left alone by attachGrid, for a consumer running its own keys.

import {
    attachCropper,
    attachGrid,
    attachMentions,
    attachRadioGroup,
    attachSplitter,
    attachSplitView,
    attachToolbar,
    attachTreePopup,
} from "./widget-keys.js";
import {
    attachChatComposer,
    attachDial,
    attachExpander,
    attachEditable,
    attachEditableForm,
    attachFileTree,
    attachHorizontalScroller,
    attachListbox,
    attachPinInput,
    attachScrollBar,
    attachShowMore,
    attachSliderButton,
    attachTileMap,
    attachTour,
    attachWheelPicker,
} from "./macro-keys.js";
import { setupOverflowNavigation } from "./navigation-menu/overflow-navigation.js";
import { initTreeList } from "./tree-list/tree.js";

/** `open` alone renders a dialog that is not modal. With `modal` it is made modal here, which is what gives it its keys. */
function showModal(dialog) {
    dialog.close();
    dialog.showModal();
    return () => dialog.close();
}

/** Wire every widget on the page, once. Returns the cleanups. */
export function autoInit(doc = document) {
    const all = (selector, wire) => [...doc.querySelectorAll(selector)].map(wire);
    return [
        ...all(".action-bar", (el) => attachToolbar(el, { dismiss: ".action-bar-clear" })),
        ...all(".action-group", (el) => attachToolbar(el)),
        ...all(".task-bar", (el) => attachToolbar(el)),
        ...all(".tool-bar", (el) => attachToolbar(el)),
        ...all(".segment-group", attachRadioGroup),
        ...all(".color-picker", attachRadioGroup),
        ...all(".splitter", (el) => attachSplitter(el)),
        ...all(".split-view", (el) => attachSplitView(el)),
        ...all(".cascader", (el) => attachTreePopup(el, { exclusive: true })),
        ...all(".tree-select", (el) => attachTreePopup(el)),
        ...all(".mentions-input", (el) => attachMentions(el)),
        ...all(".image-cropper", (el) => attachCropper(el)),
        ...all(".kanban-table", (el) => attachGrid(el)),
        ...all(".data-table", (el) => attachGrid(el)),
        ...all(".calendar-table", (el) => attachGrid(el)),
        ...all(".calendar-year-table", (el) => attachGrid(el)),
        ...all(".calendar-month-table", (el) => attachGrid(el)),
        ...all(".calendar-week-table", (el) => attachGrid(el)),
        ...all(".calendar-day-table", (el) => attachGrid(el)),
        ...all(".gantt-table", (el) => attachGrid(el)),
        ...all(".dial[role=slider]", attachDial),
        ...all(".expander", attachExpander),
        ...all(".slider-button", attachSliderButton),
        ...all(".pin-input-div", attachPinInput),
        ...all(".scroll-bar", attachScrollBar),
        ...all(".tile-map", attachTileMap),
        ...all(".wheel-picker", attachWheelPicker),
        ...all(".horizontal-scroller", attachHorizontalScroller),
        ...all(".editable", attachEditable),
        ...all(".editable-form", attachEditableForm),
        ...all(".tour", attachTour),
        ...all("[role='listbox'].listbox", attachListbox),
        ...all(".tree-menu", (el) => {
            const tree = initTreeList(el);
            return () => tree.dispose();
        }),
        ...all(".file-tree", attachFileTree),
        ...all(".chat-composer", attachChatComposer),
        ...all(".show-more", attachShowMore),
        ...all("dialog[data-modal][open]", showModal),
        ...all(".navigation-menu[data-overflow='true']", (el) => {
            const overflow = setupOverflowNavigation(el);
            return () => overflow?.dispose();
        }),
    ];
}
