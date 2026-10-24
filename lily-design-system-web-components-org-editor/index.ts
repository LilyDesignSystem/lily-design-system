/**
 * Barrel re-export for `<lily-org-editor>`.
 *
 * Importing this module registers the custom element under the tag name
 * `"lily-org-editor"`. Registration is idempotent. To use another tag name,
 * import the class from `./org-editor` and call `customElements.define`.
 */
import { OrgEditor, nextOrgEditorId } from "./org-editor.js";
export { OrgEditor, nextOrgEditorId };
export type { Labels } from "./org-editor.js";
export {
    applyTool,
    toggleWrap,
    toggleHeading,
    shiftHeadings,
    toggleList,
    cycleCheckbox,
    toggleBlock,
    cycleTodo,
    cyclePriority,
    togglePlanning,
    addProperty,
    insertContact,
    insertLink,
    insertTimestamp,
    dayStamp,
    localToday,
    TOOL_IDS,
    TOOL_GROUPS,
    WRAP_MARKERS,
} from "./org-format.js";
export type { ToolId, WrapTool, LineTool, BlockTool, TaskTool, OrgOptions, Edit } from "./org-format.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-org-editor")) {
    customElements.define("lily-org-editor", OrgEditor);
}
