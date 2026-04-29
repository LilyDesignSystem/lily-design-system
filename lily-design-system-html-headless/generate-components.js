#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const COMPONENTS_DIR = path.join(__dirname, "components");

// kebab-case to PascalCase
function toPascal(kebab) {
  return kebab
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

// Determine HTML tag from component name suffix patterns
function getTag(name) {
  if (name.endsWith("-nav")) return "nav";
  if (name.endsWith("-list-item")) return "li";
  if (name.endsWith("-list")) return "ol";
  if (name.endsWith("-table-head")) return "thead";
  if (name.endsWith("-table-body")) return "tbody";
  if (name.endsWith("-table-foot")) return "tfoot";
  if (name.endsWith("-table-col")) return "th";
  if (name.endsWith("-table-row")) return "tr";
  if (name.endsWith("-table-data")) return "td";
  if (name.endsWith("-table")) return "table";
  if (name.endsWith("-input") || name === "input") return "input";
  if (name.endsWith("-button")) return "button";
  if (name === "button") return "button";
  if (name.endsWith("-dialog") || name === "dialog") return "dialog";
  if (name.endsWith("-fieldset") || name === "fieldset") return "fieldset";
  if (name.endsWith("-footer") || name === "footer") return "footer";
  if (name.endsWith("-header") || name === "header") return "header";
  if (name.endsWith("-aside")) return "aside";
  if (name.endsWith("-main")) return "main";
  if (name.endsWith("-meter") || name === "meter") return "meter";
  if (name.endsWith("-kbd") || name === "kbd") return "kbd";
  if (name.endsWith("-option") || name === "option") return "option";
  if (name.endsWith("-select") || name === "select") return "select";
  if (name.endsWith("-progress") || name === "progress") return "progress";
  if (name === "figure") return "figure";
  if (name === "textarea") return "textarea";
  if (name === "caption") return "caption";
  if (name === "label") return "label";
  if (
    name === "form" ||
    name === "editable-form" ||
    name === "data-filter-form"
  )
    return "form";
  if (name.endsWith("-picker")) return "div";
  if (name.endsWith("-div")) return "div";
  if (name.endsWith("-link")) return "a";
  if (name.endsWith("-view")) return "span";
  if (name === "image") return "img";
  // Default to div for everything else
  return "div";
}

// Determine ARIA role based on component type
function getRole(name, tag) {
  if (name === "alert" || name === "notification") return "alert";
  if (name === "alert-dialog") return "alertdialog";
  if (name === "banner") return "banner";
  if (name.endsWith("-nav") || name === "navigation-menu") return null; // nav has implicit navigation role
  if (name === "separator") return "separator";
  if (name === "switch-button") return "switch";
  if (name === "tab-bar") return "tablist";
  if (name === "tab-bar-button") return "tab";
  if (name === "menu-bar") return "menubar";
  if (
    name === "menu-bar-button" ||
    name === "menu-item" ||
    name === "context-menu-item"
  )
    return "menuitem";
  if (name === "menu" || name === "context-menu" || name === "dropdown-menu")
    return "menu";
  if (name === "dialog") return "dialog";
  if (name === "tooltip") return "tooltip";
  if (name === "listbox") return "listbox";
  if (name === "combobox") return "combobox";
  if (name === "radio-group") return "radiogroup";
  if (name === "checkbox-group") return "group";
  if (name === "toggle-group" || name === "segment-group") return "group";
  if (name === "tool-bar") return "toolbar";
  if (name === "search-input") return "searchbox";
  if (name === "progress-circle" || name === "progress-spinner")
    return "progressbar";
  if (name === "slider" || name === "dial") return "slider";
  if (name === "tree-menu" || name === "tree-list") return "tree";
  if (name === "tree-list-item") return "treeitem";
  if (name.includes("-picker") && !name.endsWith("-picker-button"))
    return "radiogroup";
  if (name.endsWith("-picker-button")) return "radio";
  if (name === "carousel") return "region";
  if (
    name === "card" ||
    name === "care-card" ||
    name === "panel" ||
    name === "floating-panel"
  )
    return "region";
  if (name === "toast" || name === "sonner") return "status";
  if (name === "skip-link") return null; // just an <a>
  if (name === "sidebar") return "complementary";
  if (tag === "nav") return null; // nav has implicit navigation role
  if (tag === "table") return null; // table has implicit role
  if (tag === "input") return null; // input has implicit role
  if (tag === "button") return null; // button has implicit role
  if (tag === "dialog") return null; // dialog has implicit role
  if (tag === "meter") return null;
  if (tag === "progress") return null;
  if (tag === "form") return null;
  if (tag === "select") return null;
  if (tag === "textarea") return null;
  if (tag === "img") return null;
  return null;
}

// Component definitions: [kebab-name, description]
const COMPONENTS = [
  [
    "accordion-nav",
    "a navigation container for collapsible accordion information",
  ],
  ["accordion-list", "an ordered list of accordion list item components"],
  ["accordion-list-item", "one accordion list item component"],
  ["action-link", "a hyperlink styled as an action trigger"],
  [
    "ai-label",
    "an indicator of AI instances that is a pathway to AI explainability",
  ],
  [
    "alert-dialog",
    "a modal dialog for urgent messages requiring user acknowledgment",
  ],
  ["alert", "a status message for important information or feedback"],
  [
    "angle-slider-range-input",
    "a range input for selecting an angle in degrees",
  ],
  ["aspect-ratio-container", "a container that maintains a fixed aspect ratio"],
  ["avatar", "an avatar indicator that shows an avatar image or avatar text"],
  ["avatar-image", "an avatar indicator inside image such as a user photo"],
  ["avatar-text", "an avatar indicator inner text such as a user name"],
  ["back-link", "a navigation link to return to a previous page"],
  ["badge", "a small label for counts, statuses, or categories"],
  ["banner", "a prominent message bar across the top of a page"],
  ["beach-ball", "a decorative animated beach ball element"],
  ["breadcrumb-nav", "a navigation container for breadcrumb trail links"],
  ["breadcrumb-list", "an ordered list of breadcrumb navigation items"],
  ["breadcrumb-list-item", "one breadcrumb navigation link in the trail"],
  ["button", "a generic clickable button element"],
  ["button-input", "an input element of type button for form actions"],
  [
    "calendar-table",
    "a calendar table interactive grid for managing dates, days, etc.",
  ],
  [
    "calendar-table-head",
    "a calendar table interactive grid thead for managing dates, days, etc.",
  ],
  [
    "calendar-table-body",
    "a calendar table interactive grid tbody for managing dates, days, etc.",
  ],
  [
    "calendar-table-foot",
    "a calendar table interactive grid tfoot for managing dates, days, etc.",
  ],
  [
    "calendar-table-col",
    "a calendar table interactive grid column for managing dates, days, etc.",
  ],
  [
    "calendar-table-row",
    "a calendar table interactive grid row for managing dates, days, etc.",
  ],
  [
    "calendar-table-data",
    "a calendar table interactive grid data cell for managing dates, days, etc.",
  ],
  [
    "calendar-range-picker",
    "a picker for selecting a date range on a calendar",
  ],
  ["call-to-action", "a prominent prompt encouraging user action"],
  ["caption", "a caption for a table or figure element"],
  ["card", "a grouped content container with header, body, and footer areas"],
  ["care-card", "a medical care instruction card with urgency levels"],
  ["carousel", "a slideshow for cycling through content items"],
  [
    "character-counter",
    "a counter showing remaining or used characters in a text field",
  ],
  ["character", "a single character display element"],
  ["checkbox-input", "a checkbox input for toggling a boolean value"],
  [
    "checkbox-group",
    "a group component that manages a collection of checkboxes with shared state",
  ],
  ["check-list", "an ordered list of check list item components"],
  ["check-list-item", "one check list item component with a checkbox"],
  ["clipboard-copy-button", "a button that copies text to the clipboard"],
  ["collapsible", "a container that can be expanded or collapsed"],
  ["color-input", "an input for selecting a color value"],
  [
    "color-picker",
    "a two-dimensional board for picking colors by hue and saturation",
  ],
  ["color-picker-button", "a button showing a color swatch in a color picker"],
  [
    "combobox",
    "a text input combined with a dropdown list for filtering options",
  ],
  ["command", "a command palette for searching and executing actions"],
  ["contents-nav", "a navigation landmark for a list of contents"],
  ["contents-list", "an ordered list of contents list item components"],
  [
    "contents-list-item",
    "one contents list item component linking to a page section",
  ],
  ["context-menu", "a menu that appears on right-click or long-press"],
  ["context-menu-item", "one item in a context menu"],
  [
    "currency-input",
    "a locale-aware currency input with automatic formatting, symbols, separators",
  ],
  ["data-filter-form", "a form for filtering data by criteria"],
  [
    "data-table",
    "a data table interactive grid for displaying and sorting tabular data",
  ],
  [
    "data-table-head",
    "a data table interactive grid thead for displaying and sorting tabular data",
  ],
  [
    "data-table-body",
    "a data table interactive grid tbody for displaying and sorting tabular data",
  ],
  [
    "data-table-foot",
    "a data table interactive grid tfoot for displaying and sorting tabular data",
  ],
  [
    "data-table-col",
    "a data table interactive grid column for displaying and sorting tabular data",
  ],
  [
    "data-table-row",
    "a data table interactive grid row for displaying and sorting tabular data",
  ],
  [
    "data-table-data",
    "a data table interactive grid data cell for displaying and sorting tabular data",
  ],
  ["date-field", "a structured field for entering date components"],
  ["date-input", "an input for entering a date value"],
  ["date-range", "a display of a start and end date range"],
  [
    "datetime-local-input",
    "an input for entering a date and time without time zone",
  ],
  ["details", "a disclosure widget that shows and hides content"],
  ["dial", "a rotary dial control for selecting a value"],
  ["dialog", "a modal or non-modal dialog window"],
  ["do-list", "a guideline list of encouraged do-list-item components"],
  ["do-list-item", "an encouraged-practice item in a do-list guideline list"],
  ["dont-list", "a guideline list of discouraged dont-list-item components"],
  [
    "dont-list-item",
    "a discouraged-practice item in a dont-list guideline list",
  ],
  ["drawer", "a panel that slides in from the edge of the screen"],
  ["dropdown-menu", "a menu that opens below a trigger button"],
  ["editable-form", "a form wrapper for inline editing of content"],
  [
    "editable",
    "an inline-editable text element that toggles between view and edit modes",
  ],
  ["email-link", "a mailto hyperlink for an email address"],
  ["email-input", "an input for entering an email address"],
  [
    "emoji-character-picker",
    "a picker for browsing and selecting emoji characters",
  ],
  ["emoji", "a single emoji character with accessible name"],
  ["error-message", "an error message associated with a form field"],
  ["error-summary", "a summary of all validation errors on a form"],
  ["expander", "a control that expands to reveal more content"],
  ["field", "a form field wrapper with label, input, and error message"],
  ["fieldset", "a group of related form fields with a legend"],
  ["figure", "a self-contained figure with optional caption"],
  ["file-dialog", "a dialog for browsing and selecting files"],
  ["file-input", "an input for selecting files from the file system"],
  ["file-manager", "a file browser for navigating and managing files"],
  ["file-upload", "a drag-and-drop area for uploading files"],
  [
    "five-face-rating-view",
    "a read-only display of a five-face satisfaction rating",
  ],
  [
    "five-face-rating-picker",
    "a picker for selecting a 1-5 satisfaction rating using face labels",
  ],
  [
    "five-face-rating-picker-button",
    "a picker button for selecting a 1-5 satisfaction rating using face labels",
  ],
  ["five-star-rating-view", "a read-only display of a five-star rating"],
  [
    "five-star-rating-picker",
    "a picker for selecting a 1-5 star rating using radio buttons",
  ],
  [
    "five-star-rating-picker-button",
    "a picker button for selecting a 1-5 star rating using radio buttons",
  ],
  ["flair", "a decorative highlight or emphasis element"],
  ["floating-panel", "a panel that floats above page content"],
  ["footer", "a page or section footer area"],
  ["footnote", "a footnote reference and content element"],
  ["form", "a form element for collecting and submitting user data"],
  [
    "gantt-table",
    "a Gantt chart table interactive grid for planning schedule visualization",
  ],
  [
    "gantt-table-thead",
    "a Gantt chart table interactive grid thead for planning schedule visualization",
  ],
  [
    "gantt-table-tbody",
    "a Gantt chart table interactive grid tbody for planning schedule visualization",
  ],
  [
    "gantt-table-tfoot",
    "a Gantt chart table interactive grid tfoot for planning schedule visualization",
  ],
  [
    "gantt-table-th",
    "a Gantt chart table interactive grid column for planning schedule visualization",
  ],
  [
    "gantt-table-tr",
    "a Gantt chart table interactive grid row for planning schedule visualization",
  ],
  [
    "gantt-table-td",
    "a Gantt chart table interactive grid data cell for planning schedule visualization",
  ],
  [
    "grail-layout",
    "a responsive web design structure with header, left aside, center main, right aside, footer",
  ],
  ["grail-layout-top-header", "grail layout top header full width"],
  ["grail-layout-left-aside", "grail layout left aside sidebar"],
  ["grail-layout-center-main", "grail layout center main content"],
  ["grail-layout-right-aside", "grail layout right aside sidebar"],
  ["grail-layout-bottom-footer", "grail layout bottom footer full width"],
  ["hamburger-menu", "a toggle button that opens a mobile navigation menu"],
  ["header", "a page or section header area"],
  ["hidden-input", "a hidden input for including data in form submission"],
  ["hint", "hint text providing guidance for a form field"],
  ["hover-card", "a card that appears on hover over a trigger element"],
  ["icon", "a container for displaying an icon"],
  ["image-file-input", "an input for selecting image files with preview"],
  ["image", "an image element with alt text"],
  ["image-input", "a graphical submit button that displays an image"],
  ["information-callout", "a callout box highlighting informational content"],
  ["input", "a generic HTML input element"],
  ["inset-text", "indented text to distinguish it from surrounding content"],
  [
    "kanban-table",
    "a kanban board table interactive grid for organizing items by status",
  ],
  [
    "kanban-table-head",
    "a kanban board table interactive grid thead for organizing items by status",
  ],
  [
    "kanban-table-body",
    "a kanban board table interactive grid tbody for organizing items by status",
  ],
  [
    "kanban-table-foot",
    "a kanban board table interactive grid tfoot for organizing items by status",
  ],
  [
    "kanban-table-col",
    "a kanban board table interactive grid column for organizing items by status",
  ],
  [
    "kanban-table-row",
    "a kanban board table interactive grid row for organizing items by status",
  ],
  [
    "kanban-table-data",
    "kanban board table interactive grid data cell for organizing items by status",
  ],
  [
    "kbd",
    "show keyboard shortcuts and key combinations in a styled inline element",
  ],
  ["label", "a label associated with a form input"],
  ["listbox", "a list of selectable options with keyboard navigation"],
  [
    "measurement-instance-input",
    "an input for entering a measurement value and unit",
  ],
  [
    "measurement-instance-view",
    "a read-only display of a measurement value and unit",
  ],
  ["measurement-system-input", "an input for selecting a measurement system"],
  ["measurement-system-view", "a read-only display of a measurement system"],
  ["measurement-unit-input", "an input for selecting a measurement unit"],
  ["measurement-unit-view", "a read-only display of a measurement unit"],
  [
    "medical-record-red-box",
    "a red highlighted box for critical medical record information",
  ],
  ["menu", "a list of actions or options triggered by a button"],
  ["menu-item", "one item in a menu"],
  ["menu-bar", "a horizontal bar of menu triggers"],
  ["menu-bar-button", "one item in a menu bar"],
  ["meter", "a gauge displaying a scalar value within a known range"],
  ["month-input", "an input for selecting a month and year"],
  ["navigation-menu", "a site-wide navigation menu with links"],
  ["net-promoter-score-view", "a read-only display of a Net Promoter Score"],
  [
    "net-promoter-score-picker",
    "a picker for selecting a 0-10 Net Promoter Score",
  ],
  [
    "net-promoter-score-picker-button",
    "a picker button for selecting a 0-10 Net Promoter Score",
  ],
  ["notification", "a brief message about an event or update"],
  ["number-input", "an input for entering a numeric value with validation"],
  ["option", "an option element within a select dropdown"],
  ["pagination-nav", "navigation container for page navigation links"],
  ["pagination-list", "an ordered list of page navigation links"],
  ["pagination-list-item", "one page link in a pagination list"],
  ["panel", "a generic content panel with optional heading"],
  ["password-input", "an input for entering a password with obscured text"],
  [
    "password-input-or-text-input-div",
    "an input for entering a password or text with show/hide toggle",
  ],
  [
    "pin-input-div",
    "a series of single-digit inputs for entering a PIN or OTP code",
  ],
  ["popover", "a floating content box anchored to a trigger element"],
  ["popup", "a temporary overlay that appears above page content"],
  ["postal-code-input", "an input for entering a postal or ZIP code"],
  ["postal-code-view", "a read-only display of a postal or ZIP code"],
  ["progress-circle", "a circular progress indicator"],
  ["progress-spinner", "an indeterminate spinning progress indicator"],
  ["progress", "a horizontal progress bar showing completion"],
  ["qr-code", "a QR code image generated from text or URL data"],
  ["radio-group", "a group of radio buttons for selecting one option"],
  ["radio-input", "a single radio button input"],
  ["range-input", "a slider input for selecting a value within a range"],
  ["red-amber-green-view", "a read-only display of a red/amber/green status"],
  ["red-amber-green-picker", "a picker for selecting a red/amber/green status"],
  [
    "red-amber-green-picker-button",
    "a picker button for selecting a red/amber/green status",
  ],
  [
    "red-orange-yellow-green-blue-view",
    "a read-only display of a five-level color status",
  ],
  [
    "red-orange-yellow-green-blue-picker",
    "a picker for selecting a five-level color status",
  ],
  [
    "red-orange-yellow-green-blue-picker-button",
    "a picker button for selecting a five-level color status",
  ],
  ["reset-input", "a button input that resets a form to default values"],
  ["resizable", "a container that the user can resize by dragging"],
  ["review-date", "a display of a content review date"],
  ["scroll-area", "a scrollable container with custom scrollbar support"],
  ["scroll-bar", "a custom scrollbar element"],
  ["search-input", "an input for entering a search query"],
  ["segment-group", "a group of mutually exclusive segment options"],
  ["segment-group-item", "one selectable segment in a segment group"],
  [
    "select-with-extras",
    "a select dropdown with additional features like search or groups",
  ],
  ["select", "a dropdown select element for choosing one option"],
  ["separator", "a horizontal or vertical divider between content sections"],
  ["sheet", "a panel that slides in from a screen edge as an overlay"],
  ["sidebar", "a side panel for navigation or supplementary content"],
  ["signature-pad", "a drawing area for capturing a handwritten signature"],
  ["skeleton", "a placeholder loading animation for content"],
  ["skip-link", "a hidden link for keyboard users to skip to main content"],
  ["slide-out-drawer", "a drawer that slides out from the side of the page"],
  ["slider", "a draggable control for selecting a value along a track"],
  ["sonner", "a toast notification manager"],
  ["sparkline", "a small inline chart showing a data trend"],
  ["splitter", "a draggable divider for resizing adjacent panels"],
  ["submit-input", "a button input that submits a form"],
  ["summary-list", "an ordered list of key-value summary pairs"],
  ["summary-list-item", "one key-value pair in a summary list"],
  ["switch-button", "a toggle switch for turning a setting on or off"],
  ["tab-bar", "a group of tabs for switching between content panels"],
  ["tab-bar-button", "one tab button in a tab group"],
  ["table", "a table with rows and columns"],
  ["table-head", "a table header section"],
  ["table-body", "a table body section"],
  ["table-foot", "a table footer section"],
  ["table-col", "a table column header"],
  ["table-row", "a table row"],
  ["table-data", "a table data cell"],
  ["tag-group", "a group of tag elements"],
  ["tag", "a keyword label for categorizing content"],
  ["tag-input", "an input for adding and removing tags"],
  ["task-bar", "a horizontal bar of task shortcuts or actions"],
  ["task-bar-button", "one item in a task bar"],
  ["task-list", "an ordered list of task list items"],
  ["task-list-item", "one task item with a checkbox and label"],
  ["tel-input", "an input for entering a telephone number"],
  ["tel-link", "a tel hyperlink for a telephone number"],
  ["text-input", "a single-line text input field"],
  ["textarea", "a multi-line text input area"],
  ["theme-picker", "a picker for selecting a visual theme"],
  ["theme-select", "a select dropdown for choosing a theme"],
  ["theme-select-option", "one option in a theme select dropdown"],
  ["theme-view", "a read-only display of the current theme"],
  ["time-input", "an input for entering a time value"],
  ["time-picker-input", "an input with a dropdown for picking a time"],
  ["timeline-list", "an ordered list of chronological events or milestones"],
  ["timeline-list-item", "one event in a timeline list"],
  ["timer", "a countdown or elapsed time display"],
  ["toast", "a brief auto-dismissing notification message"],
  ["toggle-group", "a group of toggle buttons for selecting options"],
  [
    "toggle-button",
    "a button that toggles between pressed and unpressed states",
  ],
  ["tool-bar", "a horizontal bar of tool actions"],
  ["tool-bar-button", "one action button in a tool bar"],
  ["tooltip", "a small popup showing descriptive text on hover or focus"],
  [
    "tour",
    "a tour guide, such as for sightseeing, or pathways, or demonstrations, etc.",
  ],
  ["tour-list", "an ordered list of tour guide steps"],
  ["tour-list-item", "one step in a tour guide list"],
  ["tree-menu", "a hierarchical tree menu with expandable branches"],
  ["tree-nav", "a hierarchical navigation with expandable branches"],
  ["tree-list", "a hierarchical list with nested expandable items"],
  ["tree-list-item", "one item in a tree navigation list"],
  [
    "united-kingdom-national-health-service-number-input",
    "an input for entering a UK NHS number",
  ],
  [
    "united-kingdom-national-health-service-number-view",
    "a read-only display of a UK NHS number",
  ],
  [
    "united-states-social-security-number-input",
    "an input for entering a US Social Security number",
  ],
  [
    "united-states-social-security-number-view",
    "a read-only display of a US Social Security number",
  ],
  ["url-input", "an input for entering a URL"],
  ["warning-callout", "a callout box highlighting a warning message"],
  ["week-input", "an input for selecting a week and year"],
];

// Input type mappings
const INPUT_TYPES = {
  "angle-slider-range-input": "range",
  "button-input": "button",
  "checkbox-input": "checkbox",
  "color-input": "color",
  "currency-input": "text",
  "date-input": "date",
  "datetime-local-input": "datetime-local",
  "email-input": "email",
  "file-input": "file",
  "hidden-input": "hidden",
  "image-file-input": "file",
  "image-input": "image",
  input: "text",
  "measurement-instance-input": "number",
  "measurement-system-input": "text",
  "measurement-unit-input": "text",
  "month-input": "month",
  "number-input": "number",
  "password-input": "password",
  "postal-code-input": "text",
  "radio-input": "radio",
  "range-input": "range",
  "reset-input": "reset",
  "search-input": "search",
  "submit-input": "submit",
  "tag-input": "text",
  "tel-input": "tel",
  "text-input": "text",
  "time-input": "time",
  "time-picker-input": "time",
  "united-kingdom-national-health-service-number-input": "text",
  "united-states-social-security-number-input": "text",
  "url-input": "url",
  "week-input": "week",
};

// Self-closing tags
const SELF_CLOSING = new Set(["input", "img"]);

// Generate the inner content for the main element
function getInnerContent(name, tag, pascal) {
  if (SELF_CLOSING.has(tag)) return "";

  // Table sub-components - no inner content needed
  if (["thead", "tbody", "tfoot", "tr"].includes(tag)) {
    return "\n  <!-- Consumer provides child elements -->";
  }
  if (tag === "th" || tag === "td") {
    return "\n  <!-- Consumer provides cell content -->";
  }

  if (tag === "ol" || tag === "ul") {
    return "\n  <!-- Consumer provides list items -->";
  }
  if (tag === "li") {
    return "\n  <!-- Consumer provides item content -->";
  }

  if (tag === "nav") {
    return "\n  <!-- Consumer provides navigation list -->";
  }

  if (tag === "button") {
    return "\n  <!-- Consumer provides button content -->";
  }

  if (tag === "dialog") {
    return "\n  <!-- Consumer provides dialog content -->";
  }

  if (tag === "form") {
    return "\n  <!-- Consumer provides form fields -->";
  }

  if (tag === "select") {
    return "\n  <!-- Consumer provides option elements -->";
  }

  if (tag === "option") {
    return "\n  <!-- Consumer provides option text -->";
  }

  if (tag === "textarea") {
    return "";
  }

  if (tag === "meter") {
    return "\n  <!-- Consumer provides fallback text -->";
  }

  if (tag === "progress") {
    return "\n  <!-- Consumer provides fallback text -->";
  }

  if (tag === "figure") {
    return "\n  <!-- Consumer provides figure content and optional caption -->";
  }

  if (tag === "fieldset") {
    return (
      '\n  <legend class="' +
      name +
      '-legend"><!-- Consumer provides legend text --></legend>\n  <!-- Consumer provides form fields -->'
    );
  }

  if (tag === "label") {
    return "\n  <!-- Consumer provides label text -->";
  }

  if (tag === "caption") {
    return "\n  <!-- Consumer provides caption text -->";
  }

  if (tag === "kbd") {
    return "\n  <!-- Consumer provides key text -->";
  }

  if (tag === "a") {
    return "\n  <!-- Consumer provides link text -->";
  }

  if (tag === "span") {
    return "\n  <!-- Consumer provides text content -->";
  }

  if (tag === "table") {
    return "\n  <!-- Consumer provides thead, tbody, tfoot -->";
  }

  return "\n  <!-- Consumer provides content -->";
}

// Generate attributes for the main element
function getAttributes(name, tag, role) {
  let attrs = [];

  attrs.push(`class="${name}"`);

  if (role) {
    attrs.push(`role="${role}"`);
  }

  // aria-label for components that need it
  const needsLabel =
    ![
      "option",
      "label",
      "caption",
      "kbd",
      "li",
      "td",
      "th",
      "tr",
      "thead",
      "tbody",
      "tfoot",
      "img",
    ].includes(tag) &&
    !name.endsWith("-list-item") &&
    !name.endsWith("-table-data") &&
    !name.endsWith("-table-row") &&
    !name.endsWith("-table-col") &&
    !name.endsWith("-table-head") &&
    !name.endsWith("-table-body") &&
    !name.endsWith("-table-foot");

  if (needsLabel && tag !== "input" && tag !== "select" && tag !== "textarea") {
    attrs.push('aria-label=""');
  }

  // Input-specific attributes
  if (tag === "input") {
    const inputType = INPUT_TYPES[name];
    if (inputType) {
      attrs.push(`type="${inputType}"`);
    }

    attrs.push('aria-label=""');

    if (name === "angle-slider-range-input") {
      attrs.push('min="0"');
      attrs.push('max="360"');
      attrs.push('step="1"');
    }

    if (name === "hidden-input") {
      // hidden inputs don't need aria-label
      attrs = attrs.filter((a) => a !== 'aria-label=""');
    }
  }

  // Specific components
  if (name === "meter") {
    attrs.push('min="0"');
    attrs.push('max="100"');
    attrs.push('value="0"');
  }

  if (name === "progress") {
    attrs.push('max="100"');
    attrs.push('value="0"');
  }

  if (name === "image") {
    attrs.push('src=""');
    attrs.push('alt=""');
  }

  if (name === "email-link") {
    attrs.push('href="mailto:"');
  }

  if (name === "tel-link") {
    attrs.push('href="tel:"');
  }

  if (name === "action-link" || name === "back-link" || name === "skip-link") {
    attrs.push('href=""');
  }

  if (name === "switch-button") {
    attrs.push('aria-checked="false"');
  }

  if (name === "toggle-button") {
    attrs.push('aria-pressed="false"');
  }

  if (name === "collapsible" || name === "expander") {
    attrs.push('data-expanded="false"');
  }

  if (name === "dialog" || name === "alert-dialog" || name === "file-dialog") {
    attrs.push('aria-modal="true"');
  }

  if (name === "drawer" || name === "sheet" || name === "slide-out-drawer") {
    attrs.push('data-open="false"');
  }

  if (name === "details") {
    // Use native <details> element
  }

  if (name === "tooltip") {
    attrs.push('aria-hidden="true"');
  }

  if (name === "popover" || name === "popup" || name === "hover-card") {
    attrs.push('data-open="false"');
  }

  if (name === "carousel") {
    attrs.push('aria-roledescription="carousel"');
  }

  if (name === "tab-bar-button") {
    attrs.push('aria-selected="false"');
    attrs.push('tabindex="-1"');
  }

  if (name === "textarea") {
    attrs.push('aria-label=""');
  }

  if (
    name === "select" ||
    name === "select-with-extras" ||
    name === "theme-select"
  ) {
    attrs.push('aria-label=""');
  }

  return attrs;
}

// Handle special tag overrides
function getActualTag(name, tag) {
  if (name === "details") return "details";
  if (name === "do-list" || name === "dont-list") return "ul";
  if (name === "check-list-item" || name === "task-list-item") return "li";
  if (name === "emoji") return "span";
  if (name === "character") return "span";
  if (name === "date-range") return "span";
  if (name === "review-date") return "span";
  if (name === "character-counter") return "span";
  if (name === "badge") return "span";
  if (name === "tag") return "span";
  if (name === "flair") return "span";
  if (name === "icon") return "span";
  if (name === "ai-label") return "span";
  if (name === "error-message") return "span";
  if (name === "hint") return "span";
  if (name === "inset-text") return "div";
  if (name === "information-callout") return "div";
  if (name === "warning-callout") return "div";
  if (name === "medical-record-red-box") return "div";
  if (name === "notification") return "div";
  if (name === "banner") return "div";
  if (name === "card") return "div";
  if (name === "care-card") return "div";
  if (name === "panel") return "div";
  if (name === "skeleton") return "div";
  if (name === "separator") return "hr";
  if (name === "footnote") return "span";
  if (name === "call-to-action") return "div";
  if (name === "error-summary") return "div";
  if (name === "field") return "div";
  if (name === "date-field") return "div";
  if (name === "editable") return "div";
  if (name === "toast") return "div";
  if (name === "sonner") return "div";
  if (name === "timer") return "div";
  if (name === "sparkline") return "div";
  if (name === "qr-code") return "div";
  if (name === "beach-ball") return "div";
  if (name === "drawer") return "div";
  if (name === "sheet") return "div";
  if (name === "slide-out-drawer") return "div";
  if (name === "floating-panel") return "div";
  if (name === "popover") return "div";
  if (name === "popup") return "div";
  if (name === "hover-card") return "div";
  if (name === "tooltip") return "div";
  if (name === "carousel") return "div";
  if (name === "progress-circle") return "div";
  if (name === "progress-spinner") return "div";
  if (name === "scroll-area") return "div";
  if (name === "scroll-bar") return "div";
  if (name === "resizable") return "div";
  if (name === "splitter") return "div";
  if (name === "slider") return "div";
  if (name === "dial") return "div";
  if (name === "aspect-ratio-container") return "div";
  if (name === "grail-layout") return "div";
  if (name === "sidebar") return "aside";
  if (name === "collapsible") return "div";
  if (name === "expander") return "div";
  if (name === "hamburger-menu") return "button";
  if (name === "file-upload") return "div";
  if (name === "file-manager") return "div";
  if (name === "signature-pad") return "div";
  if (name === "combobox") return "div";
  if (name === "command") return "div";
  if (name === "listbox") return "div";
  if (name === "radio-group") return "div";
  if (name === "checkbox-group") return "div";
  if (name === "toggle-group") return "div";
  if (name === "segment-group") return "div";
  if (name === "segment-group-item") return "button";
  if (name === "tag-group") return "div";
  if (name === "tag-input") return "div";
  if (name === "pin-input-div") return "div";
  if (name === "password-input-or-text-input-div") return "div";
  if (name === "switch-button") return "button";
  if (name === "toggle-button") return "button";
  if (name === "tree-menu") return "div";
  if (name === "navigation-menu") return "nav";
  if (name === "menu") return "div";
  if (name === "context-menu") return "div";
  if (name === "dropdown-menu") return "div";
  if (name === "menu-item") return "div";
  if (name === "context-menu-item") return "div";
  if (name === "tab-bar") return "div";
  if (name === "menu-bar") return "div";
  if (name === "tool-bar") return "div";
  if (name === "task-bar") return "div";
  if (name === "tour") return "div";
  if (name === "currency-input") return "div";
  if (name === "measurement-instance-input") return "div";
  if (name === "measurement-system-input") return "div";
  if (name === "measurement-unit-input") return "div";
  return tag;
}

// Determine if component needs JavaScript
function needsScript(name) {
  const interactive = [
    "accordion-nav",
    "alert-dialog",
    "carousel",
    "clipboard-copy-button",
    "collapsible",
    "color-picker",
    "combobox",
    "command",
    "context-menu",
    "details",
    "dial",
    "dialog",
    "drawer",
    "dropdown-menu",
    "editable",
    "editable-form",
    "emoji-character-picker",
    "expander",
    "file-dialog",
    "file-manager",
    "file-upload",
    "five-face-rating-picker",
    "five-star-rating-picker",
    "hamburger-menu",
    "hover-card",
    "listbox",
    "menu",
    "menu-bar",
    "net-promoter-score-picker",
    "password-input-or-text-input-div",
    "pin-input-div",
    "popover",
    "popup",
    "red-amber-green-picker",
    "red-orange-yellow-green-blue-picker",
    "resizable",
    "scroll-area",
    "sheet",
    "signature-pad",
    "slide-out-drawer",
    "slider",
    "sonner",
    "splitter",
    "switch-button",
    "tab-bar",
    "tag-input",
    "theme-picker",
    "time-picker-input",
    "timer",
    "toast",
    "toggle-button",
    "toggle-group",
    "tooltip",
    "tour",
    "tree-menu",
    "tree-nav",
    "calendar-range-picker",
    "character-counter",
    "data-filter-form",
    "segment-group",
    "currency-input",
  ];
  return interactive.includes(name);
}

// Generate script content for interactive components
function getScript(name, pascal) {
  if (!needsScript(name)) return "";

  let body = "";

  switch (name) {
    case "switch-button":
      body = `    document.querySelectorAll('.switch-button').forEach(function(el) {
      el.addEventListener('click', function() {
        var pressed = el.getAttribute('aria-checked') === 'true';
        el.setAttribute('aria-checked', String(!pressed));
      });
      el.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          el.click();
        }
      });
    });`;
      break;
    case "toggle-button":
      body = `    document.querySelectorAll('.toggle-button').forEach(function(el) {
      el.addEventListener('click', function() {
        var pressed = el.getAttribute('aria-pressed') === 'true';
        el.setAttribute('aria-pressed', String(!pressed));
      });
    });`;
      break;
    case "clipboard-copy-button":
      body = `    document.querySelectorAll('.clipboard-copy-button').forEach(function(el) {
      el.addEventListener('click', function() {
        var text = el.getAttribute('data-clipboard-text') || el.textContent;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function() {
            el.setAttribute('data-copied', 'true');
          });
        }
      });
    });`;
      break;
    case "collapsible":
    case "expander":
      body = `    document.querySelectorAll('.${name}').forEach(function(el) {
      var trigger = el.querySelector('[data-trigger]');
      var content = el.querySelector('[data-content]');
      if (trigger && content) {
        trigger.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
        trigger.addEventListener('click', function() {
          var expanded = trigger.getAttribute('aria-expanded') === 'true';
          trigger.setAttribute('aria-expanded', String(!expanded));
          content.setAttribute('aria-hidden', String(expanded));
          el.setAttribute('data-expanded', String(!expanded));
        });
      }
    });`;
      break;
    case "dialog":
    case "alert-dialog":
    case "file-dialog":
      body = `    document.querySelectorAll('.${name}').forEach(function(el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          el.close ? el.close() : el.setAttribute('data-open', 'false');
        }
      });
    });`;
      break;
    case "tab-bar":
      body = `    document.querySelectorAll('.tab-bar').forEach(function(tabBar) {
      var tabs = tabBar.querySelectorAll('[role="tab"]');
      tabBar.addEventListener('keydown', function(e) {
        var index = Array.from(tabs).indexOf(document.activeElement);
        if (index < 0) return;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          tabs[(index + 1) % tabs.length].focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          tabs[(index - 1 + tabs.length) % tabs.length].focus();
        }
      });
      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
          tabs.forEach(function(t) {
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
          });
          tab.setAttribute('aria-selected', 'true');
          tab.setAttribute('tabindex', '0');
        });
      });
    });`;
      break;
    case "menu-bar":
      body = `    document.querySelectorAll('.menu-bar').forEach(function(bar) {
      var items = bar.querySelectorAll('[role="menuitem"]');
      bar.addEventListener('keydown', function(e) {
        var index = Array.from(items).indexOf(document.activeElement);
        if (index < 0) return;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          items[(index + 1) % items.length].focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          items[(index - 1 + items.length) % items.length].focus();
        }
      });
    });`;
      break;
    case "hamburger-menu":
      body = `    document.querySelectorAll('.hamburger-menu').forEach(function(el) {
      el.addEventListener('click', function() {
        var expanded = el.getAttribute('aria-expanded') === 'true';
        el.setAttribute('aria-expanded', String(!expanded));
        var target = document.getElementById(el.getAttribute('aria-controls'));
        if (target) {
          target.setAttribute('aria-hidden', String(expanded));
        }
      });
    });`;
      break;
    case "password-input-or-text-input-div":
      body = `    document.querySelectorAll('.password-input-or-text-input-div').forEach(function(el) {
      var input = el.querySelector('input');
      var toggle = el.querySelector('[data-toggle]');
      if (input && toggle) {
        toggle.addEventListener('click', function() {
          var isPassword = input.type === 'password';
          input.type = isPassword ? 'text' : 'password';
          toggle.setAttribute('aria-pressed', String(isPassword));
        });
      }
    });`;
      break;
    case "timer":
      body = `    document.querySelectorAll('.timer').forEach(function(el) {
      var display = el.querySelector('[data-display]');
      if (display) {
        el.setAttribute('aria-live', 'polite');
      }
    });`;
      break;
    case "character-counter":
      body = `    document.querySelectorAll('.character-counter').forEach(function(el) {
      el.setAttribute('aria-live', 'polite');
    });`;
      break;
    case "toast":
    case "sonner":
      body = `    document.querySelectorAll('.${name}').forEach(function(el) {
      el.setAttribute('aria-live', 'polite');
    });`;
      break;
    default:
      body = `    // ${pascal}: consumer implements interactive behavior
    document.querySelectorAll('.${name}').forEach(function(el) {
      // Interactive behavior initialization
    });`;
      break;
  }

  return `
<script>
  // ${pascal} behavior
  (function() {
    'use strict';
${body}
  })();
</script>`;
}

// Generate keyboard section for comments
function getKeyboard(name, tag) {
  if (tag === "button" || name.endsWith("-button"))
    return "Tab to focus, Enter or Space to activate";
  if (tag === "a") return "Tab to focus, Enter to follow link";
  if (tag === "input" || tag === "select" || tag === "textarea")
    return "Tab to focus, standard input keyboard interactions";
  if (name === "dialog" || name === "alert-dialog" || name === "file-dialog")
    return "Tab to cycle focus within dialog, Escape to close";
  if (name === "tab-bar")
    return "Tab to focus tab list, Arrow Left/Right to navigate tabs, Enter/Space to select";
  if (name === "menu-bar")
    return "Tab to focus, Arrow Left/Right to navigate, Enter to activate";
  if (name === "tree-menu" || name === "tree-nav")
    return "Arrow Up/Down to navigate, Arrow Right to expand, Arrow Left to collapse, Enter to select";
  if (name === "combobox")
    return "Tab to focus, Arrow Down to open list, type to filter, Enter to select, Escape to close";
  if (name === "listbox")
    return "Tab to focus, Arrow Up/Down to navigate, Enter to select";
  if (name === "carousel")
    return "Tab to focus controls, Arrow Left/Right to navigate slides";
  if (name === "collapsible" || name === "expander")
    return "Tab to focus trigger, Enter or Space to toggle";
  if (name === "switch-button") return "Tab to focus, Enter or Space to toggle";
  if (name === "slider" || name === "dial")
    return "Tab to focus, Arrow keys to adjust value";
  return "None (passive element)";
}

// Generate accessibility section for comments
function getAccessibility(name, tag, role) {
  const parts = [];
  if (role) parts.push(`role="${role}"`);
  if (tag === "nav") parts.push("Implicit navigation role");
  if (tag === "button") parts.push("Implicit button role");
  if (tag === "input") parts.push("Implicit input role");
  if (tag === "table") parts.push("Implicit table role");
  if (tag === "dialog") parts.push("Implicit dialog role");
  parts.push("aria-label for accessible name");
  if (name === "switch-button") parts.push("aria-checked for toggle state");
  if (name === "toggle-button") parts.push("aria-pressed for toggle state");
  if (name === "dialog" || name === "alert-dialog")
    parts.push("aria-modal for modal behavior");
  return parts.join(", ");
}

// Main generation function
function generateComponent(name, description) {
  const pascal = toPascal(name);
  let tag = getTag(name);
  tag = getActualTag(name, tag);
  const role = getRole(name, tag);

  const attrs = getAttributes(name, tag, role);
  const inner = getInnerContent(name, tag, pascal);
  const script = getScript(name, pascal);
  const keyboard = getKeyboard(name, tag);
  const accessibility = getAccessibility(name, tag, role);

  const selfClosing = SELF_CLOSING.has(tag);

  let element;
  if (selfClosing) {
    element = `<${tag}\n  ${attrs.join("\n  ")}\n>`;
  } else if (tag === "hr") {
    element = `<hr\n  ${attrs.join("\n  ")}\n>`;
  } else {
    element = `<${tag}\n  ${attrs.join("\n  ")}\n>${inner}\n</${tag}>`;
  }

  const html = `<!-- ${name}.html -->
<!-- ${pascal} component -->
<!--
  Description: ${description}
  HTML tag: <${tag}>
  CSS class: ${name}
  Keyboard: ${keyboard}
  Accessibility: ${accessibility}
  Usage:
    <${tag} class="${name}"${role ? ' role="' + role + '"' : ""} aria-label="Example">
      ...
    ${selfClosing || tag === "hr" ? "" : "</" + tag + ">"}
-->

${element}
${script}`;

  return html;
}

// Create all component files
if (!fs.existsSync(COMPONENTS_DIR)) {
  fs.mkdirSync(COMPONENTS_DIR, { recursive: true });
}

let count = 0;
for (const [name, desc] of COMPONENTS) {
  const html = generateComponent(name, desc);
  const filePath = path.join(COMPONENTS_DIR, `${name}.html`);
  fs.writeFileSync(filePath, html, "utf8");
  count++;
}

console.log(`Generated ${count} component HTML files in ${COMPONENTS_DIR}`);
