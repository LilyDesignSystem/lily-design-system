/**
 * Barrel re-export for `<markdown-editor>`.
 *
 * Importing this module registers the custom element under the tag name
 * `"markdown-editor"`. Registration is idempotent. To use another tag name,
 * import the class from `./markdown-editor` and call `customElements.define`.
 */
import { MarkdownEditor, nextMarkdownEditorId } from "./markdown-editor.js";
export { MarkdownEditor, nextMarkdownEditorId };
export type { Labels } from "./markdown-editor.js";
export { applyTool, toggleWrap, toggleLines, insertLink, TOOL_IDS, WRAP_MARKERS } from "./markdown-format.js";
export type { ToolId, WrapTool, LineTool, Edit } from "./markdown-format.js";

if (typeof customElements !== "undefined" && !customElements.get("markdown-editor")) {
    customElements.define("markdown-editor", MarkdownEditor);
}
