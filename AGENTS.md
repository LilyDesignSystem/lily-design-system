# Lily Design System

[CSS style sheet template](css-style-sheet-template.css)

Subprojects for headless components:

- [Lily Design System: HTML headless](lily-html-headless)
- [Lily Design System: Svelte headless](lily-svelte-headless)
- [Lily Design System: Blazor headless](lily-blazor-headless)
- [Lily Design System: React headless](lily-react-headless)
- [Lily Design System: Vue headless](lily-vue-headless)

Subprojects for web app examples:

- [Lily Design System: HTML JavaScript examples](lily-html-javascript-examples)
- [Lily Design System: Svelte SvelteKit examples](lily-svelte-sveltekit-examples)
- [Lily Design System: Blazor Web examples](lily-blazor-web-examples)
- [Lily Design System: React Next.js examples](lily-react-next-examples)
- [Lily Design System: Vue Nuxt.js examples](lily-vue-nuxt-examples)

NHS UK Design System References:

- [NHS UK - Design system](https://service-manual.nhs.uk/design-system)
- [NHS UK - Design system - Styles - Focus State](https://service-manual.nhs.uk/design-system/styles/focus-state)
- [NHS UK - Design system - Styles - Icons](https://service-manual.nhs.uk/design-system/styles/icons)
- [NHS UK - Design system - Styles - Layout](https://service-manual.nhs.uk/design-system/styles/layout)
- [NHS UK - Design system - Styles - Page Template](https://service-manual.nhs.uk/design-system/styles/page-template)
- [NHS UK - Design system - Styles - Spacing](https://service-manual.nhs.uk/design-system/styles/spacing)
- [NHS UK - Design system - Styles - Typography](https://service-manual.nhs.uk/design-system/styles/typography)
- [NHS UK - Design system - Styles - Use Frutiger Font](https://service-manual.nhs.uk/design-system/styles/use-frutiger-font)
- [NHS UK - Accessibility - Design](https://service-manual.nhs.uk/accessibility/design)
- [NHS UK - NHS Identity - Identity Guidelines - Colours](https://www.england.nhs.uk/nhsidentity/identity-guidelines/colours/)

Tools:

- [list-components](bin/list-components)
- [test-components](bin/test-components)
- [test-implementations](bin/test-implementations)

Color palette:

- primary #2563eb
- NHS blue #005eb8
- danger #dc2626
- warning #f59e0b
- success #16a34a
- page background #f9fafb
- card background #ffffff

## For each component directory

Files:

- index.md
- symlink from index.md to README.md
- AGENTS.md
- CLAUDE.md
- plan.md
- tasks.md

## Components

- accordion-nav = AccordionNav = a navigation container for collapsible accordion information
- accordion-list = AccordionList = an ordered list of accordion list item components
- accordion-list-item = AccordionListItem = one accordion list item component
- accordion-link = AccordionLink = one accordion link in the trail
- action-link = ActionLink = a hyperlink styled as an action trigger
- ai-label = AiLabel = an indicator of AI instances that is a pathway to AI explainability
- alert-dialog = AlertDialog = a modal dialog for urgent messages requiring user acknowledgment
- alert = Alert = a status message for important information or feedback
- angle-slider-range-input = AngleSliderRangeInput = a range input for selecting an angle in degrees
- aspect-ratio-container = AspectRatioContainer = a container that maintains a fixed aspect ratio
- avatar = Avatar = an avatar indicator that shows an avatar image or avatar text
- avatar-image = AvatarImage = an avatar indicator inside image such as a user photo
- avatar-text = AvatarText = an avatar indicator inner text such as a user name
- back-link = BackLink = a navigation link to return to a previous page
- badge = Badge = a small label for counts, statuses, or categories
- banner = Banner = a prominent message bar across the top of a page
- beach-ball = BeachBall = a decorative animated beach ball element
- breadcrumb-nav = BreadcrumbNav = a navigation container for breadcrumb trail links
- breadcrumb-list = BreadcrumbList = an ordered list of breadcrumb navigation items
- breadcrumb-list-item = BreadcrumbListItem = one breadcrumb navigation link in the trail
- breadcrumb-link = BreadcrumbLink = one breadcrumb link in the trail
- button = Button = a generic clickable button element
- button-input = ButtonInput = an input element of type button for form actions <input type="button">
- calendar-table = CalendarTable = a calendar table interactive grid for managing dates, days, etc. <table>
- calendar-table-head = CalendarTableHead = a calendar table interactive grid thead for managing dates, days, etc. <thead>
- calendar-table-body = CalendarTableBody = a calendar table interactive grid tbody for managing dates, days, etc. <tbody>
- calendar-table-foot = CalendarTableFoot = a calendar table interactive grid tfoot for managing dates, days, etc. <tfoot>
- calendar-table-col = CalendarTableCol = a calendar table interactive grid column for managing dates, days, etc. <th>
- calendar-table-row = CalendarTableRow = a calendar table interactive grid row for managing dates, days, etc. <tr>
- calendar-table-data = CalendarTableData = a calendar table interactive grid data cell for managing dates, days, etc. <td>
- calendar-range-picker = CalendarRangePicker = a picker for selecting a date range on a calendar
- call-to-action = CallToAction = a prominent prompt encouraging user action
- caption = Caption = a caption for a table or figure element
- card = Card = a grouped content container with header, body, and footer areas
- care-card = CareCard = a medical care instruction card with urgency levels
- carousel = Carousel = a slideshow for cycling through content items
- character-counter = CharacterCounter = a counter showing remaining or used characters in a text field
- character = Character = a single character display element
- chat-nav = ChatNav = a navigation container for chat information
- chat-list = ChatList = an ordered list of chat list item components
- chat-list-item = ChatListItem = one chat list item component, typically containing one chat message component
- chat-message = ChatMessage = a chat message shows one chat conversation message entry and all its data, including the author avatar, author name, time, etc.
- citation = Citation = a citation acknowledges the relevance of a work of another to the topic of discussion
- checkbox-input = CheckboxInput = a checkbox input for toggling a boolean value <input type="checkbox">
- checkbox-group = CheckboxGroup = a group component that manages a collection of checkboxes with shared state
- check-list = CheckList = an ordered list of check list item components
- check-list-item = CheckListItem = one check list item component with a checkbox
- clipboard-copy-button = ClipboardCopyButton = a button that copies text to the clipboard
- collapsible = Collapsible = a container that can be expanded or collapsed
- code = Code = an inline code span for displaying short code snippets within surrounding text
- color-input = ColorInput = an input for selecting a color value <input type="color">
- color-picker = ColorPicker = a two-dimensional board for picking colors by hue and saturation
- color-picker-button = ColorPickerButton = a button showing a color swatch in a color picker
- comment = Comment = a comment displays user discussions and user feedback
- combobox = Combobox = a text input combined with a dropdown list for filtering options
- command = Command = a command palette for searching and executing actions
- contents-nav = ContentsNav = a navigation landmark for a list of contents
- contents-list = ContentsList = an ordered list of contents list item components
- contents-list-item = ContentsListItem = one contents list item component linking to a page section
- context-menu = ContextMenu = a menu that appears on right-click or long-press
- context-menu-item = ContextMenuItem = one item in a context menu
- currency-input = CurrencyInput = a locale-aware currency input with automatic formatting, symbols, separators
- data-filter-form = DataFilterForm = a form for filtering data by criteria
- data-table = DataTable = a data table interactive grid for displaying and sorting tabular data <table>
- data-table-head = DataTableHead = a data table interactive grid thead for displaying and sorting tabular data <thead>
- data-table-body = DataTableBody = a data table interactive grid tbody for displaying and sorting tabular data <tbody>
- data-table-foot = DataTableFoot = a data table interactive grid tfoot for displaying and sorting tabular data <tfoot>
- data-table-col = DataTableCol = a data table interactive grid column for displaying and sorting tabular data <th>
- data-table-row = DataTableRow = a data table interactive grid row for displaying and sorting tabular data <tr>
- data-table-data = DataTableData = a data table interactive grid data cell for displaying and sorting tabular data <td>
- date-field = DateField = a structured field for entering date components
- date-input = DateInput = an input for entering a date value <input type="date">
- date-range = DateRange = a display of a start and end date range
- datetime-local-input = DatetimeLocalInput = an input for entering a date and time without time zone <input type="datetime-local">
- details = Details = a disclosure widget that shows and hides content
- dial = Dial = a rotary dial control for selecting a value
- diff = Diff = a side-by-side comparison of two items
- digital-object-identifier-link = DigitalObjectIdentifierLink = a permanent hyperlink for a Digital Object Identifier (DOI) to an electronic source
- dialog = Dialog = a modal or non-modal dialog window
- do-list = DoList = a guideline list of encouraged do-list-item components
- do-list-item = DoListItem = an encouraged-practice item in a do-list guideline list
- dont-list = DontList = a guideline list of discouraged dont-list-item components
- dont-list-item = DontListItem = a discouraged-practice item in a dont-list guideline list
- drawer = Drawer = a panel that slides in from the edge of the screen
- dropdown-menu = DropdownMenu = a menu that opens below a trigger button
- editable-form = EditableForm = a form wrapper for inline editing of content
- editable = Editable = an inline-editable text element that toggles between view and edit modes
- email-link = EmailLink = a mailto hyperlink for an email address
- email-input = EmailInput = an input for entering an email address <input type="email">
- emoji-character-picker = EmojiCharacterPicker = a picker for browsing and selecting emoji characters
- emoji = Emoji = a single emoji character with accessible name
- error-message = ErrorMessage = an error message associated with a form field
- event = Event = an event component that contains other event-related information
- error-summary = ErrorSummary = a summary of all validation errors on a form
- expander = Expander = a control that expands to reveal more content
- field = Field = a form field wrapper with label, input, and error message
- fieldset = Fieldset = a group of related form fields with a legend
- figure = Figure = a self-contained figure with optional caption
- file-dialog = FileDialog = a dialog for browsing and selecting files
- file-input = FileInput = an input for selecting files from the file system <input type="file">
- file-manager = FileManager = a file browser for navigating and managing files
- file-upload = FileUpload = a drag-and-drop area for uploading files
- five-face-rating-view = FiveFaceRatingView = a read-only display of a five-face satisfaction rating
- five-face-rating-picker = FiveFaceRatingPicker = a picker for selecting a 1-5 satisfaction rating using face labels
- five-face-rating-picker-button = FiveFaceRatingPickerButton = a picker button for selecting a 1-5 satisfaction rating using face labels
- five-star-rating-view = FiveStarRatingView = a read-only display of a five-star rating
- five-star-rating-picker = FiveStarRatingPicker = a picker for selecting a 1-5 star rating using radio buttons
- five-star-rating-picker-button = FiveStarRatingPickerButton = a picker button for selecting a 1-5 star rating using radio buttons
- flair = Flair = a decorative highlight or emphasis element
- floating-panel = FloatingPanel = a panel that floats above page content
- footer = Footer = a page or section footer area
- footnote = Footnote = a footnote reference and content element
- form = Form = a form element for collecting and submitting user data
- gantt-table = GanttTable = a Gantt chart table interactive grid for planning schedule visualization <table>
- gantt-table-head = GanttTableHead = a Gantt chart table interactive grid thead for planning schedule visualization <thead>
- gantt-table-body = GanttTableBody = a Gantt chart table interactive grid tbody for planning schedule visualization <tbody>
- gantt-table-foot = GanttTableFoot = a Gantt chart table interactive grid tfoot for planning schedule visualization <tfoot>
- gantt-table-col = GanttTableCol = a Gantt chart table interactive grid column for planning schedule visualization <th>
- gantt-table-row = GanttTableRow = a Gantt chart table interactive grid row for planning schedule visualization <tr>
- gantt-table-data = GanttTableData = a Gantt chart table interactive grid data cell for planning schedule visualization <td>
- grail-layout = GrailLayout = a responsive web design structure with header, left aside, center main, right aside, footer
- grail-layout-top-header = GrailLayoutTopHeader = grail layout top header full width with <header> tag
- grail-layout-left-aside = GrailLayoutLeftAside = grail layout left aside sidebar with <aside> tag
- grail-layout-center-main = GrailLayoutCenterMain = grail layout center main content with <main> tag
- grail-layout-right-aside = GrailLayoutRightAside = grail layout right aside sidebar with <aside> tag
- grail-layout-bottom-footer = GrailLayoutBottomFooter = grail layout bottom footer full width with <footer> tag
- hamburger-menu = HamburgerMenu = a toggle button that opens a mobile navigation menu
- header = Header = a page or section header area
- hidden-input = HiddenInput = a hidden input for including data in form submission <input type="hidden">
- hint = Hint = hint text providing guidance for a form field
- hover-card = HoverCard = a card that appears on hover over a trigger element
- icon = Icon = a container for displaying an icon
- image-file-input = ImageFileInput = an input for selecting image files with preview
- image = Image = an image element with alt text
- image-input = ImageInput = a graphical submit button that displays an image <input type="image">
- information-callout = InformationCallout = a callout box highlighting informational content
- input = Input = a generic HTML input element
- inset-text = InsetText = indented text to distinguish it from surrounding content
- kanban-table = KanbanTable = a kanban board table interactive grid for organizing items by status <table>
- kanban-table-head = KanbanTableHead = a kanban board table interactive grid thead for organizing items by status <thead>
- kanban-table-body = KanbanTableBody = a kanban board table interactive grid tbody for organizing items by status <tbody>
- kanban-table-foot = KanbanTableFoot = a kanban board table interactive grid tfoot for organizing items by status <tfoot>
- kanban-table-col = KanbanTableCol = a kanban board table interactive grid column for organizing items by status <th>
- kanban-table-row = KanbanTableRow = a kanban board table interactive grid row for organizing items by status <tr>
- kanban-table-data = KanbanTableData = kanban board table interactive grid data cell for organizing items by status <td>
- kbd = Kbd = show keyboard shortcuts and key combinations in a styled inline element
- label = Label = a label associated with a form input
- listbox = Listbox = a list of selectable options with keyboard navigation
- loading = Loading = a loading indicator, such as text, or image, or animation
- measurement-instance-input = MeasurementInstanceInput = an input for entering a measurement value and unit
- measurement-instance-view = MeasurementInstanceView = a read-only display of a measurement value and unit
- measurement-system-input = MeasurementSystemInput = an input for selecting a measurement system
- measurement-system-view = MeasurementSystemView = a read-only display of a measurement system
- measurement-unit-input = MeasurementUnitInput = an input for selecting a measurement unit
- measurement-unit-view = MeasurementUnitView = a read-only display of a measurement unit
- medical-record-red-box = MedicalRecordRedBox = a red highlighted box for critical medical record information
- menu = Menu = a list of actions or options triggered by a button
- menu-item = MenuItem = one item in a menu
- menu-bar = MenuBar = a horizontal bar of menu triggers
- menu-bar-button = MenuBarButton = one item in a menu bar
- meter = Meter = a gauge displaying a scalar value within a known range
- mockup-browser = MockupBrowser = a box area that looks like a web browser
- mockup-laptop = MockupLaptop = a box area that looks like a laptop computer
- mockup-phone = MockupPhone = a box area that looks like a mobile phone
- mockup-tablet-landscape = MockupTabletLandscape = a box area that looks like a tablet computer in landscape mode
- mockup-tablet-portrait = MockupTabletPortrait = a box area that looks like a tablet computer in portrait mode
- mockup-shell = MockupShell = a box area that looks like a terminal shell
- mockup-watch = MockupWatch = a box area that looks like a smart watch
- mockup-window = MockupWindow = a box area that looks like a desktop window
- month-input = MonthInput = an input for selecting a month and year <input type="month">
- navigation-menu = NavigationMenu = a site-wide navigation menu with links
- net-promoter-score-view = NetPromoterScoreView = a read-only display of a Net Promoter Score
- net-promoter-score-picker = NetPromoterScorePicker = a picker for selecting a 0-10 Net Promoter Score
- net-promoter-score-picker-button = NetPromoterScorePickerButton = a picker button for selecting a 0-10 Net Promoter Score
- notification = Notification = a brief message about an event or update
- number-input = NumberInput = an input for entering a numeric value with validation <input type="number">
- option = Option = an option element within a select dropdown
- organization = Organization = an organization component that contains other organization-related information
- pagination-nav = PaginationNav = an ordered list of page navigation links
- pagination-list = PaginationList = an ordered list of page navigation links
- pagination-list-item = PaginationListItem = one page link in a pagination list
- pagination-link = PaginationLink = one pagination link in the trail
- panel = Panel = a generic content panel with optional heading
- person = Person = a person component that contains other person-related information
- password-input = PasswordInput = an input for entering a password with obscured text <input type="password">
- password-input-or-text-input-div = PasswordInputOrTextInputDiv = an input for entering a password <input type="password"> or text <input type="text"> with show/hide toggle
- place = Place = a place component that contains other place-related information
- pin-input-div = PinInputDiv = a series of single-digit inputs for entering a PIN or OTP code
- popover = Popover = a floating content box anchored to a trigger element
- popup = Popup = a temporary overlay that appears above page content
- postal-code-input = PostalCodeInput = an input for entering a postal or ZIP code
- postal-code-view = PostalCodeView = a read-only display of a postal or ZIP code
- progress-circle = ProgressCircle = a circular progress indicator
- progress-spinner = ProgressSpinner = an indeterminate spinning progress indicator
- progress = Progress = a horizontal progress bar showing completion
- qr-code = QrCode = a QR code image generated from text or URL data
- radio-group = RadioGroup = a group of radio buttons for selecting one option
- radio-input = RadioInput = a single radio button input <input type="radio">
- range-input = RangeInput = a slider input for selecting a value within a range <input type="range">
- red-amber-green-view = RedAmberGreenView = a read-only display of a red/amber/green status
- red-amber-green-picker = RedAmberGreenPicker = a picker for selecting a red/amber/green status
- red-amber-green-picker-button = RedAmberGreenPickerButton = a picker button for selecting a red/amber/green status
- red-orange-yellow-green-blue-view = RedOrangeYellowGreenBlueView = a read-only display of a five-level color status
- red-orange-yellow-green-blue-picker = RedOrangeYellowGreenBluePicker = a picker for selecting a five-level color status
- red-orange-yellow-green-blue-picker-button = RedOrangeYellowGreenBluePickerButton = a picker button for selecting a five-level color status
- reset-input = ResetInput = a button input that resets a form to default values <input type="reset">
- resizable = Resizable = a container that the user can resize by dragging
- review-date = ReviewDate = a display of a content review date
- scroll-area = ScrollArea = a scrollable container with custom scrollbar support
- scroll-bar = ScrollBar = a custom scrollbar element
- search-input = SearchInput = an input for entering a search query <input type="search">
- segment-group = SegmentGroup = a group of mutually exclusive segment options
- segment-group-item = SegmentGroupItem = one selectable segment in a segment group
- select-with-extras = SelectWithExtras = a select dropdown with additional features like search or groups
- select = Select = a dropdown select element for choosing one option
- separator = Separator = a horizontal or vertical divider between content sections
- sheet = Sheet = a panel that slides in from a screen edge as an overlay
- sidebar = Sidebar = a side panel for navigation or supplementary content
- signature-pad = SignaturePad = a drawing area for capturing a handwritten signature
- skeleton = Skeleton = a placeholder loading animation for content
- skip-link = SkipLink = a hidden link for keyboard users to skip to main content
- slide-out-drawer = SlideOutDrawer = a drawer that slides out from the side of the page
- slider = Slider = a draggable control for selecting a value along a track
- slider-button = SliderButton = a button with a slider that the user needs to slide to confirm
- sonner = Sonner = a toast notification manager
- sparkline = Sparkline = a small inline chart showing a data trend
- splitter = Splitter = a draggable divider for resizing adjacent panels
- submit-input = SubmitInput = a button input that submits a form <input type="submit">
- super-banner = SuperBanner = a super-banner communicates a high-priority state that affects an entire app, experience, process, or system
- summary-list = SummaryList = an ordered list of key-value summary pairs
- summary-list-item = SummaryListItem = one key-value pair in a summary list
- switch-button = SwitchButton = a toggle switch for turning a setting on or off
- tab-bar = TabBar = a group of tabs for switching between content panels
- tab-bar-button = TabBarButton = one tab button in a tab group
- table = Table = a table with rows and columns <table>
- table-head = TableHead = a table interactive grid thead <thead>
- table-body = TableBody = a table interactive grid tbody <tbody>
- table-foot = TableFoot = a table interactive grid tfoot <tfoot>
- table-col = TableCol = a table interactive grid column <th>
- table-row = TableRow = a table interactive grid row <tr>
- table-data = TableData = a table interactive grid data cell <td>
- tag-group = TagGroup = a group of tag elements
- tag = Tag = a keyword label for categorizing content
- tag-input = TagInput = an input for adding and removing tags
- task-bar = TaskBar = a horizontal bar of task shortcuts or actions
- task-bar-button = TaskBarButton = one item in a task bar
- task-list = TaskList = an ordered list of task list items
- task-list-item = TaskListItem = one task item with a checkbox and label
- tel-input = TelInput = an input for entering a telephone number <input type="tel">
- tel-link = TelLink = a tel hyperlink for a telephone number
- text-input = TextInput = a single-line text input field <input type="text">
- textarea = Textarea = a multi-line text input area
- theme-picker = ThemePicker = a picker for selecting a visual theme
- theme-select = ThemeSelect = a select dropdown for choosing a theme
- theme-select-option = ThemeSelectOption = one option in a theme select dropdown
- theme-view = ThemeView = a read-only display of the current theme
- time-input = TimeInput = an input for entering a time value <input type="time">
- time-picker-input = TimePickerInput = an input with a dropdown for picking a time
- timeline-list = TimelineList = an ordered list of chronological events or milestones
- timeline-list-item = TimelineListItem = one event in a timeline list
- tile = Tile = a grouping container that presents related content in a structured format, often as a single clickable area
- timer = Timer = a countdown or elapsed time display
- timer-button = TimerButton = a button with a timer that will automatically click after a given amount of time
- toast = Toast = a brief auto-dismissing notification message
- toggle-group = ToggleGroup = a group of toggle buttons for selecting options
- toggle-button = ToggleButton = a button that toggles between pressed and unpressed states
- tool-bar = ToolBar = a horizontal bar of tool actions
- tool-bar-button = ToolBarButton = one action button in a tool bar
- tooltip = Tooltip = a small popup showing descriptive text on hover or focus
- tour = Tour = a tour guide, such as for sightseeing, or pathways, or demonstrations, etc.
- tour-list = TourList = an ordered list of tour guide steps
- tour-list-item = TourListItem = one step in a tour guide list
- tree-menu = TreeMenu = a hierarchical tree menu with expandable branches
- tree-nav = TreeNav = a hierarchical navigation with expandable branches
- tree-list = TreeList = a hierarchical list with nested expandable items
- tree-list-item = TreeListItem = one item in a tree navigation list
- tree-link = TreeLink = one tree link in the trail
- united-kingdom-national-health-service-number-input = UnitedKingdomNationalHealthServiceNumberInput = an input for entering a UK NHS number
- united-kingdom-national-health-service-number-view = UnitedKingdomNationalHealthServiceNumberView = a read-only display of a UK NHS number
- united-states-social-security-number-input = UnitedStatesSocialSecurityNumberInput = an input for entering a US Social Security number
- united-states-social-security-number-view = UnitedStatesSocialSecurityNumberView = a read-only display of a US Social Security number
- url-input = UrlInput = an input for entering a URL <input type="url">
- vital-sign-blood-pressure-diastolic-as-mmhg-view = VitalSignBloodPressureDiastolicAsMmhgView = number display of one vital sign blood pressure diastolic with integers
- vital-sign-blood-pressure-diastolic-as-mmhg-input = VitalSignBloodPressureDiastolicAsMmhgInput = number input of one vital sign blood pressure diastolic with integers
- vital-sign-blood-pressure-systolic-as-mmhg-view = VitalSignBloodPressureSystolicAsMmhgView = number display of one vital sign blood pressure systolic with integers
- vital-sign-blood-pressure-systolic-as-mmhg-input = VitalSignBloodPressureSystolicAsMmhgInput = number input of one vital sign blood pressure systolic with integers
- vital-sign-body-fat-as-percentage-view = VitalSignBodyFatAsPercentageView = number display of one vital sign body fat percentage with one decimal point
- vital-sign-body-fat-as-percentage-input = VitalSignBodyFatAsPercentageInput = number input of one vital sign body fat percentage with one decimal point
- vital-sign-body-temperature-as-celcius-view = VitalSignBodyTemperatureAsCelciusView = number display of one vital sign body temperature in Celsius degrees with one decimal point
- vital-sign-body-temperature-as-celcius-input = VitalSignBodyTemperatureAsCelciusInput = number input of one vital sign body temperature in Celsius degrees with one decimal point
- vital-sign-cholesterol-as-hdl-mmol-per-litre-view = VitalSignCholesterolAsHdlMmolPerLitreView = number display of one vital sign cholesterol HDL (good cholesterol) millimole per litre with one decimal point
- vital-sign-cholesterol-as-hdl-mmol-per-litre-input = VitalSignCholesterolAsHdlMmolPerLitreInput = number input of one vital sign cholesterol HDL (good cholesterol) millimole per litre with one decimal point
- vital-sign-cholesterol-as-ldl-mmol-per-litre-view = VitalSignCholesterolAsLdlMmolPerLitreView = number display of one vital sign cholesterol LDL (bad cholesterol) millimole per litre with one decimal point
- vital-sign-cholesterol-as-ldl-mmol-per-litre-input = VitalSignCholesterolAsLdlMmolPerLitreInput = number input of one vital sign cholesterol LDL (bad cholesterol) millimole per litre with one decimal point
- vital-sign-heart-rate-as-beats-per-minute-view = VitalSignHeartRateAsBeatsPerMinuteView = number display of one vital sign heart rate in beats per minute (BPM) with integers
- vital-sign-heart-rate-as-beats-per-minute-input = VitalSignHeartRateAsBeatsPerMinuteInput = number input of one vital sign heart rate in beats per minute (BPM) with integers
- vital-sign-heart-rate-variability-view = VitalSignHeartRateVariabilityView = number display of one vital sign heart rate variability (HRV) with integers
- vital-sign-heart-rate-variability-input = VitalSignHeartRateVariabilityInput = number input of one vital sign heart rate variability (HRV) with integers
- vital-sign-height-as-cm-view = VitalSignHeightAsCmView = number display of one vital sign height in centimetres with integers
- vital-sign-height-as-cm-input = VitalSignHeightAsCmInput = number input of one vital sign height in centimetres with integers
- vital-sign-respiratory-rate-as-breaths-per-minute-view = VitalSignRespiratoryRateAsBreathsPerMinuteView = number display of one vital sign respiratory rate in breaths per minute with integers
- vital-sign-respiratory-rate-as-breaths-per-minute-input = VitalSignRespiratoryRateAsBreathsPerMinuteInput = number input of one vital sign respiratory rate in breaths per minute with integers
- vital-sign-sleep-score-as-0-to-100-view = VitalSignSleepScoreAs0To100View = number display of one vital sign sleep score with range 0-100
- vital-sign-sleep-score-as-0-to-100-input = VitalSignSleepScoreAs0To100Input = number input of one vital sign sleep score with range 0-100
- vital-sign-total-sleep-time-as-min-per-day-view = VitalSignTotalSleepTimeAsMinPerDayView = number display of one vital sign total sleep time as minutes per day
- vital-sign-total-sleep-time-as-min-per-day-input = VitalSignTotalSleepTimeAsMinPerDayInput = number input of one vital sign total sleep time as minutes per day
- vital-sign-vo2-max-as-ml-per-kg-per-minute-view = VitalSignVo2MaxAsMlPerKgPerMinuteView = number display of one vital sign VO2 max in millilitres per kilogram per minute with integers
- vital-sign-vo2-max-as-ml-per-kg-per-minute-input = VitalSignVo2MaxAsMlPerKgPerMinuteInput = number input of one vital sign VO2 max in millilitres per kilogram per minute with integers
- vital-sign-waist-circumference-as-cm-view = VitalSignWaistCircumferenceAsCmView = number display of one vital sign waist circumference in centimetres with integers
- vital-sign-waist-circumference-as-cm-input = VitalSignWaistCircumferenceAsCmInput = number input of one vital sign waist circumference in centimetres with integers
- vital-sign-weight-as-kg-view = VitalSignWeightAsKgView = number display of one vital sign weight in kilograms with integers
- vital-sign-weight-as-kg-input = VitalSignWeightAsKgInput = number input of one vital sign weight in kilograms with integers
- warning-callout = WarningCallout = a callout box highlighting a warning message
- week-input = WeekInput = an input for selecting a week and year <input type="week">

## Component patterns for file name and HTML tag

### Suffix → HTML Element Mapping

| Suffix     | Element      | Example                                          |
| ---------- | ------------ | ------------------------------------------------ |
| article    | `<article>`  |                                                  |
| aside      | `<aside>`    | GrailLayoutLeftAside, GrailLayoutRightAside      |
| button     | `<button>`   | Button, ToggleButton, SwitchButton               |
| dialog     | `<dialog>`   | Dialog, AlertDialog, FileDialog                  |
| div        | `<div>`      | PinInputDiv, PasswordInputOrTextInputDiv         |
| fieldset   | `<fieldset>` | Fieldset                                         |
| figure     | `<figure>`   | Figure                                           |
| footer     | `<footer>`   | Footer                                           |
| header     | `<header>`   | Header                                           |
| input      | `<input>`    | TextInput, DateInput, EmailInput                 |
| kbd        | `<kbd>`      |                                                  |
| list       | `<ol>`       | CheckList, TaskList (DoList/DontList use `<ul>`) |
| list-item  | `<li>`       | CheckListItem, TaskListItem                      |
| main       | `<main>`     | GrailLayoutCenterMain                            |
| meter      | `<meter>`    | Meter                                            |
| nav        | `<nav>`      | BreadcrumbNav, TreeNav                           |
| option     | `<option>`   | Option, ThemeSelectOption                        |
| picker     | `<div>`      | ColorPicker, FiveStarRatingPicker                |
| progress   | `<progress>` | Progress                                         |
| select     | `<select>`   | Select, ThemeSelect                              |
| span       | `<span>`     | Flair, Character                                 |
| table      | `<table>`    | DataTable, CalendarTable                         |
| table-head | `<thead>`    | DataTableHead                                    |
| table-body | `<tbody>`    | DataTableBody                                    |
| table-foot | `<tfoot>`    | DataTableFoot                                    |
| table-row  | `<tr>`       | DataTableRow                                     |
| table-col  | `<th>`       | DataTableCol                                     |
| table-data | `<td>`       | DataTableData                                    |

## Component name patterns

- \*Bar \*BarButton
  - MenuBar MenuBarButton
  - TabBar TabBarButton
  - TaskBar TaskBarButton
  - ToolBar ToolBarButton
- \*Group \*GroupItem
  - SegmentGroup SegmentGroupItem
- \*Guide \*GuideList \*GuideListItem
  - Tour TourList TourListItem
- \*List \*ListItem
  - CheckList CheckListItem
  - ContentsList ContentsListItem
  - DoList DoListItem
  - DontList DontListItem
  - PaginationList PaginationListItem
  - SummaryList SummaryListItem
- \*Nav \*List \*ListItem
  - AccordionNav AccordionList AccordionListItem
  - BreadcrumbNav BreadcrumbList BreadcrumbListItem
  - ChatNav ChatList ChatListItem
  - ContentsNav ContentsList ContentsListItem
  - PaginationNav PaginationList PaginationListItem
  - TreeNav TreeList TreeListItem
- *Select *SelectOption
  - ThemeSelect ThemeSelectOption
- \*Menu \*MenuItem
  - ContextMenu ContextMenuItem
  - Menu MenuItem
- \*Input \*Link
  - TelInput TelLink
  - EmailInput EmailLink
- \*Picker \*PickerButton
  - ColorPicker ColorPickerButton
  - FiveFaceRatingPicker FiveFaceRatingPickerButton
  - FiveStarRatingPicker FiveStarRatingPickerButton
  - NetPromoterScorePicker NetPromoterScorePickerButton
  - RedAmberGreenPicker RedAmberGreenPickerButton
  - RedOrangeYellowGreenBluePicker RedOrangeYellowGreenBluePickerButton
- \*Table \*TableHead \*TableBody \*TableFoot \*TableCol \*TableRow \*TableData
  - Table TableHead TableBody TableFoot TableCol TableRow TableData
  - CalendarTable CalendarTableHead CalendarTableBody CalendarTableFoot CalendarTableCol CalendarTableRow CalendarTableData
  - DataTable DataTableHead DataTableBody DataTableFoot DataTableCol DataTableRow DataTableData
  - GanttTable GanttTableHead GanttTableBody GanttTableFoot GanttTableCol GanttTableRow GanttTableData
  - KanbanTable KanbanTableHead KanbanTableBody KanbanTableFoot KanbanTableCol KanbanTableRow KanbanTableData

## Component Composition Patterns

### Form pattern: Form → Field → Input

```tsx
<Form label="Contact" onSubmit={handleSubmit}>
  <Field label="Name" required error={errors.name}>
    <TextInput label="Name" value={name} onChange={setName} />
  </Field>
  <ErrorSummary title="Errors">
    <ul>...</ul>
  </ErrorSummary>
  <Button type="submit">Submit</Button>
</Form>
```

### Grail layout pattern: GrailLayout → GrailLayoutTop, GrailLayoutLeft, GrailLayoutCenter, GrailLayoutRight, GrailLayoutBottom

```tsx
<GrailLayout>
  <GrailLayoutTopHeader>…</GrailLayoutTopHeader>
  <GrailLayoutLeftAside>…</GrailLayoutLeftAside>
  <GrailLayoutCenterMain>…</GrailLayoutCenterMain>
  <GrailLayoutRightAside>…</GrailLayoutRightAside>
  <GrailLayoutBottomFooter>…</GrailLayoutBottomFooter>
</GrailLayout>
```

### Navigation pattern: Nav → List → ListItem

```tsx
<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem>
      <a href="/">Home</a>
    </BreadcrumbListItem>
    <BreadcrumbListItem current>Page</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

### Table pattern: Table → Head/Body → Row → Data

```tsx
<DataTable label="Users">
  <DataTableHead>
    <DataTableRow>
      <th>Name</th>
    </DataTableRow>
  </DataTableHead>
  <DataTableBody>
    <DataTableRow>
      <DataTableData>Item</DataTableData>
    </DataTableRow>
  </DataTableBody>
</DataTable>
```

### VitalSignGroupView pattern

```tsx
<VitalSignGroupView>
  <VitalSignHeartRateAsBeatsPerMinuteView>
    …
  </VitalSignHeartRateAsBeatsPerMinuteView>
  <VitalSignRespiratoryRateAsBreathsPerMinuteView>
    …
  </VitalSignRespiratoryRateAsBreathsPerMinuteView>
  <VitalSignBodyTemperatureAsCelciusView>
    …
  </VitalSignBodyTemperatureAsCelciusView>
  <VitalSignBloodPressureSystolicAsMmhgView>
    …
  </VitalSignBloodPressureSystolicAsMmhgView>
  <VitalSignBloodPressureDiastolicAsMmhgView>
    …
  </VitalSignBloodPressureDiastolicAsMmhgView>
</VitalSignGroupView>
```

### VitalSignGroupInput pattern

```tsx
<VitalSignGroupInput>
  <VitalSignHeartRateAsBeatsPerMinuteInput>
    …
  </VitalSignHeartRateAsBeatsPerMinuteInput>
  <VitalSignRespiratoryRateAsBreathsPerMinuteInput>
    …
  </VitalSignRespiratoryRateAsBreathsPerMinuteInput>
  <VitalSignBodyTemperatureAsCelciusInput>
    …
  </VitalSignBodyTemperatureAsCelciusInput>
  <VitalSignBloodPressureSystolicAsMmhgInput>
    …
  </VitalSignBloodPressureSystolicAsMmhgInput>
  <VitalSignBloodPressureDiastolicAsMmhgInput>
    …
  </VitalSignBloodPressureDiastolicAsMmhgInput>
</VitalSignGroupInput>
```

## Accessibility

### Standards

- WCAG 2.2 AAA compliance
- WAI-ARIA Authoring Practices patterns
- Semantic HTML elements over generic divs

### Common Patterns

- `<label :for="id">` — link labels to inputs
- `aria-labelledby` / `aria-describedby` — link related elements
- `:aria-invalid` + `:aria-errormessage` — error state
- `role="alert"` — announce dynamic content
- `role="group"` with `aria-label` — group related controls
- Roving tabindex (`:tabindex="selected ? 0 : -1"`) — grid navigation
- `:aria-pressed` — toggle button state
- `:aria-expanded` — expandable sections
- `aria-current` — current item in navigation

## Internationalization

- All text content through props — no hardcoded strings
- Labels, descriptions, error messages all configurable
- Consumer provides localized text via props

## Verify

Run $(bin/test)
