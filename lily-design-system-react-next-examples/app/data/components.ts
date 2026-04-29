export interface Component {
  slug: string;
  name: string;
  description: string;
}

export const components: Component[] = [
  {
    slug: "accordion-nav",
    name: "AccordionNav",
    description: "a navigation container for collapsible accordion information",
  },
  {
    slug: "accordion-list",
    name: "AccordionList",
    description: "an ordered list of accordion list item components",
  },
  {
    slug: "accordion-list-item",
    name: "AccordionListItem",
    description: "one accordion list item component",
  },
  {
    slug: "action-link",
    name: "ActionLink",
    description: "a hyperlink styled as an action trigger",
  },
  {
    slug: "ai-label",
    name: "AiLabel",
    description:
      "an indicator of AI instances that is a pathway to AI explainability",
  },
  {
    slug: "alert-dialog",
    name: "AlertDialog",
    description:
      "a modal dialog for urgent messages requiring user acknowledgment",
  },
  {
    slug: "alert",
    name: "Alert",
    description: "a status message for important information or feedback",
  },
  {
    slug: "angle-slider-range-input",
    name: "AngleSliderRangeInput",
    description: "a range input for selecting an angle in degrees",
  },
  {
    slug: "aspect-ratio-container",
    name: "AspectRatioContainer",
    description: "a container that maintains a fixed aspect ratio",
  },
  {
    slug: "avatar",
    name: "Avatar",
    description:
      "an avatar indicator that shows an avatar image or avatar text",
  },
  {
    slug: "avatar-image",
    name: "AvatarImage",
    description: "an avatar indicator inside image such as a user photo",
  },
  {
    slug: "avatar-text",
    name: "AvatarText",
    description: "an avatar indicator inner text such as a user name",
  },
  {
    slug: "back-link",
    name: "BackLink",
    description: "a navigation link to return to a previous page",
  },
  {
    slug: "badge",
    name: "Badge",
    description: "a small label for counts, statuses, or categories",
  },
  {
    slug: "banner",
    name: "Banner",
    description: "a prominent message bar across the top of a page",
  },
  {
    slug: "beach-ball",
    name: "BeachBall",
    description: "a decorative animated beach ball element",
  },
  {
    slug: "breadcrumb-nav",
    name: "BreadcrumbNav",
    description: "a navigation container for breadcrumb trail links",
  },
  {
    slug: "breadcrumb-list",
    name: "BreadcrumbList",
    description: "an ordered list of breadcrumb navigation items",
  },
  {
    slug: "breadcrumb-list-item",
    name: "BreadcrumbListItem",
    description: "one breadcrumb navigation link in the trail",
  },
  {
    slug: "button",
    name: "Button",
    description: "a generic clickable button element",
  },
  {
    slug: "button-input",
    name: "ButtonInput",
    description:
      'an input element of type button for form actions <input type="button">',
  },
  {
    slug: "calendar-table",
    name: "CalendarTable",
    description:
      "a calendar table interactive grid for managing dates, days, etc. <table>",
  },
  {
    slug: "calendar-table-head",
    name: "CalendarTableHead",
    description:
      "a calendar table interactive grid thead for managing dates, days, etc. <thead>",
  },
  {
    slug: "calendar-table-body",
    name: "CalendarTableBody",
    description:
      "a calendar table interactive grid tbody for managing dates, days, etc. <tbody>",
  },
  {
    slug: "calendar-table-foot",
    name: "CalendarTableFoot",
    description:
      "a calendar table interactive grid tfoot for managing dates, days, etc. <tfoot>",
  },
  {
    slug: "calendar-table-col",
    name: "CalendarTableCol",
    description:
      "a calendar table interactive grid column for managing dates, days, etc. <th>",
  },
  {
    slug: "calendar-table-row",
    name: "CalendarTableRow",
    description:
      "a calendar table interactive grid row for managing dates, days, etc. <tr>",
  },
  {
    slug: "calendar-table-data",
    name: "CalendarTableData",
    description:
      "a calendar table interactive grid data cell for managing dates, days, etc. <td>",
  },
  {
    slug: "calendar-range-picker",
    name: "CalendarRangePicker",
    description: "a picker for selecting a date range on a calendar",
  },
  {
    slug: "call-to-action",
    name: "CallToAction",
    description: "a prominent prompt encouraging user action",
  },
  {
    slug: "caption",
    name: "Caption",
    description: "a caption for a table or figure element",
  },
  {
    slug: "card",
    name: "Card",
    description:
      "a grouped content container with header, body, and footer areas",
  },
  {
    slug: "care-card",
    name: "CareCard",
    description: "a medical care instruction card with urgency levels",
  },
  {
    slug: "carousel",
    name: "Carousel",
    description: "a slideshow for cycling through content items",
  },
  {
    slug: "character-counter",
    name: "CharacterCounter",
    description:
      "a counter showing remaining or used characters in a text field",
  },
  {
    slug: "character",
    name: "Character",
    description: "a single character display element",
  },
  {
    slug: "checkbox-input",
    name: "CheckboxInput",
    description:
      'a checkbox input for toggling a boolean value <input type="checkbox">',
  },
  {
    slug: "checkbox-group",
    name: "CheckboxGroup",
    description:
      "a group component that manages a collection of checkboxes with shared state",
  },
  {
    slug: "check-list",
    name: "CheckList",
    description: "an ordered list of check list item components",
  },
  {
    slug: "check-list-item",
    name: "CheckListItem",
    description: "one check list item component with a checkbox",
  },
  {
    slug: "clipboard-copy-button",
    name: "ClipboardCopyButton",
    description: "a button that copies text to the clipboard",
  },
  {
    slug: "collapsible",
    name: "Collapsible",
    description: "a container that can be expanded or collapsed",
  },
  {
    slug: "color-input",
    name: "ColorInput",
    description: 'an input for selecting a color value <input type="color">',
  },
  {
    slug: "color-picker",
    name: "ColorPicker",
    description:
      "a two-dimensional board for picking colors by hue and saturation",
  },
  {
    slug: "color-picker-button",
    name: "ColorPickerButton",
    description: "a button showing a color swatch in a color picker",
  },
  {
    slug: "combobox",
    name: "Combobox",
    description:
      "a text input combined with a dropdown list for filtering options",
  },
  {
    slug: "command",
    name: "Command",
    description: "a command palette for searching and executing actions",
  },
  {
    slug: "contents-nav",
    name: "ContentsNav",
    description: "a navigation landmark for a list of contents",
  },
  {
    slug: "contents-list",
    name: "ContentsList",
    description: "an ordered list of contents list item components",
  },
  {
    slug: "contents-list-item",
    name: "ContentsListItem",
    description: "one contents list item component linking to a page section",
  },
  {
    slug: "context-menu",
    name: "ContextMenu",
    description: "a menu that appears on right-click or long-press",
  },
  {
    slug: "context-menu-item",
    name: "ContextMenuItem",
    description: "one item in a context menu",
  },
  {
    slug: "currency-input",
    name: "CurrencyInput",
    description:
      "a locale-aware currency input with automatic formatting, symbols, separators",
  },
  {
    slug: "data-filter-form",
    name: "DataFilterForm",
    description: "a form for filtering data by criteria",
  },
  {
    slug: "data-table",
    name: "DataTable",
    description:
      "a data table interactive grid for displaying and sorting tabular data <table>",
  },
  {
    slug: "data-table-head",
    name: "DataTableHead",
    description:
      "a data table interactive grid thead for displaying and sorting tabular data <thead>",
  },
  {
    slug: "data-table-body",
    name: "DataTableBody",
    description:
      "a data table interactive grid tbody for displaying and sorting tabular data <tbody>",
  },
  {
    slug: "data-table-foot",
    name: "DataTableFoot",
    description:
      "a data table interactive grid tfoot for displaying and sorting tabular data <tfoot>",
  },
  {
    slug: "data-table-col",
    name: "DataTableCol",
    description:
      "a data table interactive grid column for displaying and sorting tabular data <th>",
  },
  {
    slug: "data-table-row",
    name: "DataTableRow",
    description:
      "a data table interactive grid row for displaying and sorting tabular data <tr>",
  },
  {
    slug: "data-table-data",
    name: "DataTableData",
    description:
      "a data table interactive grid data cell for displaying and sorting tabular data <td>",
  },
  {
    slug: "date-field",
    name: "DateField",
    description: "a structured field for entering date components",
  },
  {
    slug: "date-input",
    name: "DateInput",
    description: 'an input for entering a date value <input type="date">',
  },
  {
    slug: "date-range",
    name: "DateRange",
    description: "a display of a start and end date range",
  },
  {
    slug: "datetime-local-input",
    name: "DatetimeLocalInput",
    description:
      'an input for entering a date and time without time zone <input type="datetime-local">',
  },
  {
    slug: "details",
    name: "Details",
    description: "a disclosure widget that shows and hides content",
  },
  {
    slug: "dial",
    name: "Dial",
    description: "a rotary dial control for selecting a value",
  },
  {
    slug: "dialog",
    name: "Dialog",
    description: "a modal or non-modal dialog window",
  },
  {
    slug: "do-list",
    name: "DoList",
    description: "a guideline list of encouraged do-list-item components",
  },
  {
    slug: "do-list-item",
    name: "DoListItem",
    description: "an encouraged-practice item in a do-list guideline list",
  },
  {
    slug: "dont-list",
    name: "DontList",
    description: "a guideline list of discouraged dont-list-item components",
  },
  {
    slug: "dont-list-item",
    name: "DontListItem",
    description: "a discouraged-practice item in a dont-list guideline list",
  },
  {
    slug: "drawer",
    name: "Drawer",
    description: "a panel that slides in from the edge of the screen",
  },
  {
    slug: "dropdown-menu",
    name: "DropdownMenu",
    description: "a menu that opens below a trigger button",
  },
  {
    slug: "editable-form",
    name: "EditableForm",
    description: "a form wrapper for inline editing of content",
  },
  {
    slug: "editable",
    name: "Editable",
    description:
      "an inline-editable text element that toggles between view and edit modes",
  },
  {
    slug: "email-link",
    name: "EmailLink",
    description: "a mailto hyperlink for an email address",
  },
  {
    slug: "email-input",
    name: "EmailInput",
    description: 'an input for entering an email address <input type="email">',
  },
  {
    slug: "emoji-character-picker",
    name: "EmojiCharacterPicker",
    description: "a picker for browsing and selecting emoji characters",
  },
  {
    slug: "emoji",
    name: "Emoji",
    description: "a single emoji character with accessible name",
  },
  {
    slug: "error-message",
    name: "ErrorMessage",
    description: "an error message associated with a form field",
  },
  {
    slug: "error-summary",
    name: "ErrorSummary",
    description: "a summary of all validation errors on a form",
  },
  {
    slug: "expander",
    name: "Expander",
    description: "a control that expands to reveal more content",
  },
  {
    slug: "field",
    name: "Field",
    description: "a form field wrapper with label, input, and error message",
  },
  {
    slug: "fieldset",
    name: "Fieldset",
    description: "a group of related form fields with a legend",
  },
  {
    slug: "figure",
    name: "Figure",
    description: "a self-contained figure with optional caption",
  },
  {
    slug: "file-dialog",
    name: "FileDialog",
    description: "a dialog for browsing and selecting files",
  },
  {
    slug: "file-input",
    name: "FileInput",
    description:
      'an input for selecting files from the file system <input type="file">',
  },
  {
    slug: "file-manager",
    name: "FileManager",
    description: "a file browser for navigating and managing files",
  },
  {
    slug: "file-upload",
    name: "FileUpload",
    description: "a drag-and-drop area for uploading files",
  },
  {
    slug: "five-face-rating-view",
    name: "FiveFaceRatingView",
    description: "a read-only display of a five-face satisfaction rating",
  },
  {
    slug: "five-face-rating-picker",
    name: "FiveFaceRatingPicker",
    description:
      "a picker for selecting a 1-5 satisfaction rating using face labels",
  },
  {
    slug: "five-face-rating-picker-button",
    name: "FiveFaceRatingPickerButton",
    description:
      "a picker button for selecting a 1-5 satisfaction rating using face labels",
  },
  {
    slug: "five-star-rating-view",
    name: "FiveStarRatingView",
    description: "a read-only display of a five-star rating",
  },
  {
    slug: "five-star-rating-picker",
    name: "FiveStarRatingPicker",
    description: "a picker for selecting a 1-5 star rating using radio buttons",
  },
  {
    slug: "five-star-rating-picker-button",
    name: "FiveStarRatingPickerButton",
    description:
      "a picker button for selecting a 1-5 star rating using radio buttons",
  },
  {
    slug: "flair",
    name: "Flair",
    description: "a decorative highlight or emphasis element",
  },
  {
    slug: "floating-panel",
    name: "FloatingPanel",
    description: "a panel that floats above page content",
  },
  {
    slug: "footer",
    name: "Footer",
    description: "a page or section footer area",
  },
  {
    slug: "footnote",
    name: "Footnote",
    description: "a footnote reference and content element",
  },
  {
    slug: "form",
    name: "Form",
    description: "a form element for collecting and submitting user data",
  },
  {
    slug: "gantt-table",
    name: "GanttTable",
    description:
      "a Gantt chart table interactive grid for planning schedule visualization <table>",
  },
  {
    slug: "gantt-table-thead",
    name: "GanttTableThead",
    description:
      "a Gantt chart table interactive grid thead for planning schedule visualization <thead>",
  },
  {
    slug: "gantt-table-tbody",
    name: "GanttTableTbody",
    description:
      "a Gantt chart table interactive grid tbody for planning schedule visualization <tbody>",
  },
  {
    slug: "gantt-table-tfoot",
    name: "GanttTableTfoot",
    description:
      "a Gantt chart table interactive grid tfoot for planning schedule visualization <tfoot>",
  },
  {
    slug: "gantt-table-th",
    name: "GanttTableTh",
    description:
      "a Gantt chart table interactive grid column for planning schedule visualization <th>",
  },
  {
    slug: "gantt-table-tr",
    name: "GanttTableTr",
    description:
      "a Gantt chart table interactive grid row for planning schedule visualization <tr>",
  },
  {
    slug: "gantt-table-td",
    name: "GanttTableTd",
    description:
      "a Gantt chart table interactive grid data cell for planning schedule visualization <td>",
  },
  {
    slug: "grail-layout",
    name: "GrailLayout",
    description:
      "a responsive web design structure with header, left aside, center main, right aside, footer",
  },
  {
    slug: "grail-layout-top-header",
    name: "GrailLayoutTopHeader",
    description: "grail layout top header full width with <header> tag",
  },
  {
    slug: "grail-layout-left-aside",
    name: "GrailLayoutLeftAside",
    description: "grail layout left aside sidebar with <aside> tag",
  },
  {
    slug: "grail-layout-center-main",
    name: "GrailLayoutCenterMain",
    description: "grail layout center main content with <main> tag",
  },
  {
    slug: "grail-layout-right-aside",
    name: "GrailLayoutRightAside",
    description: "grail layout right aside sidebar with <aside> tag",
  },
  {
    slug: "grail-layout-bottom-footer",
    name: "GrailLayoutBottomFooter",
    description: "grail layout bottom footer full width with <footer> tag",
  },
  {
    slug: "hamburger-menu",
    name: "HamburgerMenu",
    description: "a toggle button that opens a mobile navigation menu",
  },
  {
    slug: "header",
    name: "Header",
    description: "a page or section header area",
  },
  {
    slug: "hidden-input",
    name: "HiddenInput",
    description:
      'a hidden input for including data in form submission <input type="hidden">',
  },
  {
    slug: "hint",
    name: "Hint",
    description: "hint text providing guidance for a form field",
  },
  {
    slug: "hover-card",
    name: "HoverCard",
    description: "a card that appears on hover over a trigger element",
  },
  {
    slug: "icon",
    name: "Icon",
    description: "a container for displaying an icon",
  },
  {
    slug: "image-file-input",
    name: "ImageFileInput",
    description: "an input for selecting image files with preview",
  },
  {
    slug: "image",
    name: "Image",
    description: "an image element with alt text",
  },
  {
    slug: "image-input",
    name: "ImageInput",
    description:
      'a graphical submit button that displays an image <input type="image">',
  },
  {
    slug: "information-callout",
    name: "InformationCallout",
    description: "a callout box highlighting informational content",
  },
  { slug: "input", name: "Input", description: "a generic HTML input element" },
  {
    slug: "inset-text",
    name: "InsetText",
    description: "indented text to distinguish it from surrounding content",
  },
  {
    slug: "kanban-table",
    name: "KanbanTable",
    description:
      "a kanban board table interactive grid for organizing items by status <table>",
  },
  {
    slug: "kanban-table-head",
    name: "KanbanTableHead",
    description:
      "a kanban board table interactive grid thead for organizing items by status <thead>",
  },
  {
    slug: "kanban-table-body",
    name: "KanbanTableBody",
    description:
      "a kanban board table interactive grid tbody for organizing items by status <tbody>",
  },
  {
    slug: "kanban-table-foot",
    name: "KanbanTableFoot",
    description:
      "a kanban board table interactive grid tfoot for organizing items by status <tfoot>",
  },
  {
    slug: "kanban-table-col",
    name: "KanbanTableCol",
    description:
      "a kanban board table interactive grid column for organizing items by status <th>",
  },
  {
    slug: "kanban-table-row",
    name: "KanbanTableRow",
    description:
      "a kanban board table interactive grid row for organizing items by status <tr>",
  },
  {
    slug: "kanban-table-data",
    name: "KanbanTableData",
    description:
      "kanban board table interactive grid data cell for organizing items by status <td>",
  },
  {
    slug: "kbd",
    name: "Kbd",
    description:
      "show keyboard shortcuts and key combinations in a styled inline element",
  },
  {
    slug: "label",
    name: "Label",
    description: "a label associated with a form input",
  },
  {
    slug: "listbox",
    name: "Listbox",
    description: "a list of selectable options with keyboard navigation",
  },
  {
    slug: "measurement-instance-input",
    name: "MeasurementInstanceInput",
    description: "an input for entering a measurement value and unit",
  },
  {
    slug: "measurement-instance-view",
    name: "MeasurementInstanceView",
    description: "a read-only display of a measurement value and unit",
  },
  {
    slug: "measurement-system-input",
    name: "MeasurementSystemInput",
    description: "an input for selecting a measurement system",
  },
  {
    slug: "measurement-system-view",
    name: "MeasurementSystemView",
    description: "a read-only display of a measurement system",
  },
  {
    slug: "measurement-unit-input",
    name: "MeasurementUnitInput",
    description: "an input for selecting a measurement unit",
  },
  {
    slug: "measurement-unit-view",
    name: "MeasurementUnitView",
    description: "a read-only display of a measurement unit",
  },
  {
    slug: "medical-record-red-box",
    name: "MedicalRecordRedBox",
    description:
      "a red highlighted box for critical medical record information",
  },
  {
    slug: "menu",
    name: "Menu",
    description: "a list of actions or options triggered by a button",
  },
  { slug: "menu-item", name: "MenuItem", description: "one item in a menu" },
  {
    slug: "menu-bar",
    name: "MenuBar",
    description: "a horizontal bar of menu triggers",
  },
  {
    slug: "menu-bar-button",
    name: "MenuBarButton",
    description: "one item in a menu bar",
  },
  {
    slug: "meter",
    name: "Meter",
    description: "a gauge displaying a scalar value within a known range",
  },
  {
    slug: "month-input",
    name: "MonthInput",
    description: 'an input for selecting a month and year <input type="month">',
  },
  {
    slug: "navigation-menu",
    name: "NavigationMenu",
    description: "a site-wide navigation menu with links",
  },
  {
    slug: "net-promoter-score-view",
    name: "NetPromoterScoreView",
    description: "a read-only display of a Net Promoter Score",
  },
  {
    slug: "net-promoter-score-picker",
    name: "NetPromoterScorePicker",
    description: "a picker for selecting a 0-10 Net Promoter Score",
  },
  {
    slug: "net-promoter-score-picker-button",
    name: "NetPromoterScorePickerButton",
    description: "a picker button for selecting a 0-10 Net Promoter Score",
  },
  {
    slug: "notification",
    name: "Notification",
    description: "a brief message about an event or update",
  },
  {
    slug: "number-input",
    name: "NumberInput",
    description:
      'an input for entering a numeric value with validation <input type="number">',
  },
  {
    slug: "option",
    name: "Option",
    description: "an option element within a select dropdown",
  },
  {
    slug: "pagination-nav",
    name: "PaginationNav",
    description: "an ordered list of page navigation links",
  },
  {
    slug: "pagination-list",
    name: "PaginationList",
    description: "an ordered list of page navigation links",
  },
  {
    slug: "pagination-list-item",
    name: "PaginationListItem",
    description: "one page link in a pagination list",
  },
  {
    slug: "panel",
    name: "Panel",
    description: "a generic content panel with optional heading",
  },
  {
    slug: "password-input",
    name: "PasswordInput",
    description:
      'an input for entering a password with obscured text <input type="password">',
  },
  {
    slug: "password-input-or-text-input-div",
    name: "PasswordInputOrTextInputDiv",
    description:
      'an input for entering a password <input type="password"> or text <input type="text"> with show/hide toggle',
  },
  {
    slug: "pin-input-div",
    name: "PinInputDiv",
    description:
      "a series of single-digit inputs for entering a PIN or OTP code",
  },
  {
    slug: "popover",
    name: "Popover",
    description: "a floating content box anchored to a trigger element",
  },
  {
    slug: "popup",
    name: "Popup",
    description: "a temporary overlay that appears above page content",
  },
  {
    slug: "postal-code-input",
    name: "PostalCodeInput",
    description: "an input for entering a postal or ZIP code",
  },
  {
    slug: "postal-code-view",
    name: "PostalCodeView",
    description: "a read-only display of a postal or ZIP code",
  },
  {
    slug: "progress-circle",
    name: "ProgressCircle",
    description: "a circular progress indicator",
  },
  {
    slug: "progress-spinner",
    name: "ProgressSpinner",
    description: "an indeterminate spinning progress indicator",
  },
  {
    slug: "progress",
    name: "Progress",
    description: "a horizontal progress bar showing completion",
  },
  {
    slug: "qr-code",
    name: "QrCode",
    description: "a QR code image generated from text or URL data",
  },
  {
    slug: "radio-group",
    name: "RadioGroup",
    description: "a group of radio buttons for selecting one option",
  },
  {
    slug: "radio-input",
    name: "RadioInput",
    description: 'a single radio button input <input type="radio">',
  },
  {
    slug: "range-input",
    name: "RangeInput",
    description:
      'a slider input for selecting a value within a range <input type="range">',
  },
  {
    slug: "red-amber-green-view",
    name: "RedAmberGreenView",
    description: "a read-only display of a red/amber/green status",
  },
  {
    slug: "red-amber-green-picker",
    name: "RedAmberGreenPicker",
    description: "a picker for selecting a red/amber/green status",
  },
  {
    slug: "red-amber-green-picker-button",
    name: "RedAmberGreenPickerButton",
    description: "a picker button for selecting a red/amber/green status",
  },
  {
    slug: "red-orange-yellow-green-blue-view",
    name: "RedOrangeYellowGreenBlueView",
    description: "a read-only display of a five-level color status",
  },
  {
    slug: "red-orange-yellow-green-blue-picker",
    name: "RedOrangeYellowGreenBluePicker",
    description: "a picker for selecting a five-level color status",
  },
  {
    slug: "red-orange-yellow-green-blue-picker-button",
    name: "RedOrangeYellowGreenBluePickerButton",
    description: "a picker button for selecting a five-level color status",
  },
  {
    slug: "reset-input",
    name: "ResetInput",
    description:
      'a button input that resets a form to default values <input type="reset">',
  },
  {
    slug: "resizable",
    name: "Resizable",
    description: "a container that the user can resize by dragging",
  },
  {
    slug: "review-date",
    name: "ReviewDate",
    description: "a display of a content review date",
  },
  {
    slug: "scroll-area",
    name: "ScrollArea",
    description: "a scrollable container with custom scrollbar support",
  },
  {
    slug: "scroll-bar",
    name: "ScrollBar",
    description: "a custom scrollbar element",
  },
  {
    slug: "search-input",
    name: "SearchInput",
    description: 'an input for entering a search query <input type="search">',
  },
  {
    slug: "segment-group",
    name: "SegmentGroup",
    description: "a group of mutually exclusive segment options",
  },
  {
    slug: "segment-group-item",
    name: "SegmentGroupItem",
    description: "one selectable segment in a segment group",
  },
  {
    slug: "select-with-extras",
    name: "SelectWithExtras",
    description:
      "a select dropdown with additional features like search or groups",
  },
  {
    slug: "select",
    name: "Select",
    description: "a dropdown select element for choosing one option",
  },
  {
    slug: "separator",
    name: "Separator",
    description: "a horizontal or vertical divider between content sections",
  },
  {
    slug: "sheet",
    name: "Sheet",
    description: "a panel that slides in from a screen edge as an overlay",
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    description: "a side panel for navigation or supplementary content",
  },
  {
    slug: "signature-pad",
    name: "SignaturePad",
    description: "a drawing area for capturing a handwritten signature",
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    description: "a placeholder loading animation for content",
  },
  {
    slug: "skip-link",
    name: "SkipLink",
    description: "a hidden link for keyboard users to skip to main content",
  },
  {
    slug: "slide-out-drawer",
    name: "SlideOutDrawer",
    description: "a drawer that slides out from the side of the page",
  },
  {
    slug: "slider",
    name: "Slider",
    description: "a draggable control for selecting a value along a track",
  },
  {
    slug: "sonner",
    name: "Sonner",
    description: "a toast notification manager",
  },
  {
    slug: "sparkline",
    name: "Sparkline",
    description: "a small inline chart showing a data trend",
  },
  {
    slug: "splitter",
    name: "Splitter",
    description: "a draggable divider for resizing adjacent panels",
  },
  {
    slug: "submit-input",
    name: "SubmitInput",
    description: 'a button input that submits a form <input type="submit">',
  },
  {
    slug: "summary-list",
    name: "SummaryList",
    description: "an ordered list of key-value summary pairs",
  },
  {
    slug: "summary-list-item",
    name: "SummaryListItem",
    description: "one key-value pair in a summary list",
  },
  {
    slug: "switch-button",
    name: "SwitchButton",
    description: "a toggle switch for turning a setting on or off",
  },
  {
    slug: "tab-bar",
    name: "TabBar",
    description: "a group of tabs for switching between content panels",
  },
  {
    slug: "tab-bar-button",
    name: "TabBarButton",
    description: "one tab button in a tab group",
  },
  {
    slug: "table",
    name: "Table",
    description: "a table with rows and columns <table>",
  },
  {
    slug: "table-head",
    name: "TableHead",
    description: "a table interactive grid thead <thead>",
  },
  {
    slug: "table-body",
    name: "TableBody",
    description: "a table interactive grid tbody <tbody>",
  },
  {
    slug: "table-foot",
    name: "TableFoot",
    description: "a table interactive grid tfoot <tfoot>",
  },
  {
    slug: "table-col",
    name: "TableCol",
    description: "a table interactive grid column <th>",
  },
  {
    slug: "table-row",
    name: "TableRow",
    description: "a table interactive grid row <tr>",
  },
  {
    slug: "table-data",
    name: "TableData",
    description: "a table interactive grid data cell <td>",
  },
  {
    slug: "tag-group",
    name: "TagGroup",
    description: "a group of tag elements",
  },
  {
    slug: "tag",
    name: "Tag",
    description: "a keyword label for categorizing content",
  },
  {
    slug: "tag-input",
    name: "TagInput",
    description: "an input for adding and removing tags",
  },
  {
    slug: "task-bar",
    name: "TaskBar",
    description: "a horizontal bar of task shortcuts or actions",
  },
  {
    slug: "task-bar-button",
    name: "TaskBarButton",
    description: "one item in a task bar",
  },
  {
    slug: "task-list",
    name: "TaskList",
    description: "an ordered list of task list items",
  },
  {
    slug: "task-list-item",
    name: "TaskListItem",
    description: "one task item with a checkbox and label",
  },
  {
    slug: "tel-input",
    name: "TelInput",
    description: 'an input for entering a telephone number <input type="tel">',
  },
  {
    slug: "tel-link",
    name: "TelLink",
    description: "a tel hyperlink for a telephone number",
  },
  {
    slug: "text-input",
    name: "TextInput",
    description: 'a single-line text input field <input type="text">',
  },
  {
    slug: "textarea",
    name: "Textarea",
    description: "a multi-line text input area",
  },
  {
    slug: "theme-picker",
    name: "ThemePicker",
    description: "a picker for selecting a visual theme",
  },
  {
    slug: "theme-select",
    name: "ThemeSelect",
    description: "a select dropdown for choosing a theme",
  },
  {
    slug: "theme-select-option",
    name: "ThemeSelectOption",
    description: "one option in a theme select dropdown",
  },
  {
    slug: "theme-view",
    name: "ThemeView",
    description: "a read-only display of the current theme",
  },
  {
    slug: "time-input",
    name: "TimeInput",
    description: 'an input for entering a time value <input type="time">',
  },
  {
    slug: "time-picker-input",
    name: "TimePickerInput",
    description: "an input with a dropdown for picking a time",
  },
  {
    slug: "timeline-list",
    name: "TimelineList",
    description: "an ordered list of chronological events or milestones",
  },
  {
    slug: "timeline-list-item",
    name: "TimelineListItem",
    description: "one event in a timeline list",
  },
  {
    slug: "timer",
    name: "Timer",
    description: "a countdown or elapsed time display",
  },
  {
    slug: "toast",
    name: "Toast",
    description: "a brief auto-dismissing notification message",
  },
  {
    slug: "toggle-group",
    name: "ToggleGroup",
    description: "a group of toggle buttons for selecting options",
  },
  {
    slug: "toggle-button",
    name: "ToggleButton",
    description: "a button that toggles between pressed and unpressed states",
  },
  {
    slug: "tool-bar",
    name: "ToolBar",
    description: "a horizontal bar of tool actions",
  },
  {
    slug: "tool-bar-button",
    name: "ToolBarButton",
    description: "one action button in a tool bar",
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    description: "a small popup showing descriptive text on hover or focus",
  },
  {
    slug: "tour",
    name: "Tour",
    description:
      "a tour guide, such as for sightseeing, or pathways, or demonstrations, etc.",
  },
  {
    slug: "tour-list",
    name: "TourList",
    description: "an ordered list of tour guide steps",
  },
  {
    slug: "tour-list-item",
    name: "TourListItem",
    description: "one step in a tour guide list",
  },
  {
    slug: "tree-menu",
    name: "TreeMenu",
    description: "a hierarchical tree menu with expandable branches",
  },
  {
    slug: "tree-nav",
    name: "TreeNav",
    description: "a hierarchical navigation with expandable branches",
  },
  {
    slug: "tree-list",
    name: "TreeList",
    description: "a hierarchical list with nested expandable items",
  },
  {
    slug: "tree-list-item",
    name: "TreeListItem",
    description: "one item in a tree navigation list",
  },
  {
    slug: "united-kingdom-national-health-service-number-input",
    name: "UnitedKingdomNationalHealthServiceNumberInput",
    description: "an input for entering a UK NHS number",
  },
  {
    slug: "united-kingdom-national-health-service-number-view",
    name: "UnitedKingdomNationalHealthServiceNumberView",
    description: "a read-only display of a UK NHS number",
  },
  {
    slug: "united-states-social-security-number-input",
    name: "UnitedStatesSocialSecurityNumberInput",
    description: "an input for entering a US Social Security number",
  },
  {
    slug: "united-states-social-security-number-view",
    name: "UnitedStatesSocialSecurityNumberView",
    description: "a read-only display of a US Social Security number",
  },
  {
    slug: "url-input",
    name: "UrlInput",
    description: 'an input for entering a URL <input type="url">',
  },
  {
    slug: "warning-callout",
    name: "WarningCallout",
    description: "a callout box highlighting a warning message",
  },
  {
    slug: "week-input",
    name: "WeekInput",
    description: 'an input for selecting a week and year <input type="week">',
  },
];
