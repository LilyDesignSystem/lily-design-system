#!/usr/bin/env node
// generate-component-demos.js
// Reads components.csv (tab-separated: slug, name, description)
// Outputs a TypeScript module mapping slug → demo HTML string.

const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'components.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

const components = csvContent
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .map(line => {
    const parts = line.split('\t');
    return { slug: parts[0], name: parts[1], description: parts[2] || '' };
  })
  .filter(c => c.slug && c.name);

// Input type mapping for *-input slugs
const inputTypeMap = {
  'text-input': 'text',
  'email-input': 'email',
  'password-input': 'password',
  'search-input': 'search',
  'tel-input': 'tel',
  'url-input': 'url',
  'number-input': 'number',
  'date-input': 'date',
  'time-input': 'time',
  'month-input': 'month',
  'week-input': 'week',
  'datetime-local-input': 'datetime-local',
  'color-input': 'color',
  'file-input': 'file',
  'range-input': 'range',
  'checkbox-input': 'checkbox',
  'radio-input': 'radio',
  'hidden-input': 'hidden',
};

// Explicit demos map
const explicitDemos = {
  // Navigation composites
  'accordion-nav': '<nav class="accordion-nav" aria-label="Accordion"><ol class="accordion-list"><li class="accordion-list-item"><details><summary>Section 1</summary><p>Content 1</p></details></li><li class="accordion-list-item"><details><summary>Section 2</summary><p>Content 2</p></details></li></ol></nav>',
  'breadcrumb-nav': '<nav class="breadcrumb-nav" aria-label="Breadcrumb"><ol class="breadcrumb-list"><li class="breadcrumb-list-item"><a class="breadcrumb-link" href="#">Home</a></li><li class="breadcrumb-list-item" aria-current="page">Current Page</li></ol></nav>',
  'contents-nav': '<nav class="contents-nav" aria-label="Contents"><ol class="contents-list"><li class="contents-list-item"><a class="contents-link" href="#section-1">Section 1</a></li><li class="contents-list-item"><a class="contents-link" href="#section-2">Section 2</a></li></ol></nav>',
  'pagination-nav': '<nav class="pagination-nav" aria-label="Pagination"><ol class="pagination-list"><li class="pagination-list-item"><a class="pagination-link" href="#" aria-current="page">1</a></li><li class="pagination-list-item"><a class="pagination-link" href="#">2</a></li><li class="pagination-list-item"><a class="pagination-link" href="#">3</a></li></ol></nav>',
  'tree-nav': '<nav class="tree-nav" aria-label="Tree navigation"><ul class="tree-list"><li class="tree-list-item"><a class="tree-link" href="#">Item 1</a><ul class="tree-list"><li class="tree-list-item"><a class="tree-link" href="#">Sub-item 1.1</a></li></ul></li><li class="tree-list-item"><a class="tree-link" href="#">Item 2</a></li></ul></nav>',
  'chat-nav': '<nav class="chat-nav" aria-label="Chat"><ol class="chat-list"><li class="chat-list-item"><article class="chat-message" aria-label="Message from Alice"><p>Hello, how can I help?</p></article></li></ol></nav>',

  // Lists
  'accordion-list': '<ol class="accordion-list"><li class="accordion-list-item"><details><summary>Section 1</summary><p>Content 1</p></details></li><li class="accordion-list-item"><details><summary>Section 2</summary><p>Content 2</p></details></li></ol>',
  'breadcrumb-list': '<ol class="breadcrumb-list"><li class="breadcrumb-list-item"><a class="breadcrumb-link" href="#">Home</a></li><li class="breadcrumb-list-item" aria-current="page">Current Page</li></ol>',
  'chat-list': '<ol class="chat-list"><li class="chat-list-item"><article class="chat-message" aria-label="Message from Alice"><p>Hello, how can I help?</p></article></li></ol>',
  'contents-list': '<ol class="contents-list"><li class="contents-list-item"><a class="contents-link" href="#section-1">Section 1</a></li><li class="contents-list-item"><a class="contents-link" href="#section-2">Section 2</a></li></ol>',
  'pagination-list': '<ol class="pagination-list"><li class="pagination-list-item"><a class="pagination-link" href="#" aria-current="page">1</a></li><li class="pagination-list-item"><a class="pagination-link" href="#">2</a></li><li class="pagination-list-item"><a class="pagination-link" href="#">3</a></li></ol>',
  'tree-list': '<ul class="tree-list"><li class="tree-list-item"><a class="tree-link" href="#">Item 1</a><ul class="tree-list"><li class="tree-list-item"><a class="tree-link" href="#">Sub-item 1.1</a></li></ul></li><li class="tree-list-item"><a class="tree-link" href="#">Item 2</a></li></ul>',
  'check-list': '<ol class="check-list"><li class="check-list-item"><input type="checkbox" /> Task 1</li><li class="check-list-item"><input type="checkbox" checked /> Task 2</li></ol>',
  'task-list': '<ol class="task-list"><li class="task-list-item"><input type="checkbox" /> To-do item</li></ol>',
  'do-list': '<ul class="do-list"><li class="do-list-item">Do use semantic HTML</li><li class="do-list-item">Do add ARIA labels</li></ul>',
  'dont-list': '<ul class="dont-list"><li class="dont-list-item">Don\'t use div for buttons</li><li class="dont-list-item">Don\'t skip heading levels</li></ul>',
  'summary-list': '<ol class="summary-list"><li class="summary-list-item"><dt>Name</dt><dd>John Doe</dd></li></ol>',
  'timeline-list': '<ol class="timeline-list"><li class="timeline-list-item"><time>2026-01-01</time> Event 1</li><li class="timeline-list-item"><time>2026-02-01</time> Event 2</li></ol>',
  'tour-list': '<ol class="tour-list"><li class="tour-list-item">Step 1: Welcome</li><li class="tour-list-item">Step 2: Features</li></ol>',

  // List items
  'accordion-list-item': '<ol class="accordion-list"><li class="accordion-list-item"><details><summary>Section</summary><p>Content</p></details></li></ol>',
  'breadcrumb-list-item': '<ol class="breadcrumb-list"><li class="breadcrumb-list-item">Example list item</li></ol>',
  'chat-list-item': '<ol class="chat-list"><li class="chat-list-item"><article class="chat-message" aria-label="Message"><p>Example message</p></article></li></ol>',
  'contents-list-item': '<ol class="contents-list"><li class="contents-list-item"><a class="contents-link" href="#section">Section</a></li></ol>',
  'pagination-list-item': '<ol class="pagination-list"><li class="pagination-list-item"><a class="pagination-link" href="#">1</a></li></ol>',
  'tree-list-item': '<ul class="tree-list"><li class="tree-list-item"><a class="tree-link" href="#">Item</a></li></ul>',
  'check-list-item': '<ol class="check-list"><li class="check-list-item"><input type="checkbox" /> Task</li></ol>',
  'task-list-item': '<ol class="task-list"><li class="task-list-item"><input type="checkbox" /> Task</li></ol>',
  'do-list-item': '<ul class="do-list"><li class="do-list-item">Do use semantic HTML</li></ul>',
  'dont-list-item': '<ul class="dont-list"><li class="dont-list-item">Don\'t use div for buttons</li></ul>',
  'summary-list-item': '<ol class="summary-list"><li class="summary-list-item"><dt>Name</dt><dd>John Doe</dd></li></ol>',
  'timeline-list-item': '<ol class="timeline-list"><li class="timeline-list-item"><time>2026-01-01</time> Event</li></ol>',
  'tour-list-item': '<ol class="tour-list"><li class="tour-list-item">Step 1: Welcome</li></ol>',

  // Links
  'accordion-link': '<a class="accordion-link" href="#">Accordion link</a>',
  'breadcrumb-link': '<a class="breadcrumb-link" href="#">Breadcrumb link</a>',
  'contents-link': '<a class="contents-link" href="#section">Contents link</a>',
  'pagination-link': '<a class="pagination-link" href="#">Page 1</a>',
  'tree-link': '<a class="tree-link" href="#">Tree link</a>',
  'action-link': '<a class="action-link" href="#">Take action</a>',
  'back-link': '<a class="back-link" href="#">Back</a>',
  'skip-link': '<a class="skip-link" href="#main-content">Skip to main content</a>',
  'email-link': '<a class="email-link" href="mailto:example@example.com">example@example.com</a>',
  'tel-link': '<a class="tel-link" href="tel:+1234567890">+1 234 567 890</a>',
  'digital-object-identifier-link': '<a class="digital-object-identifier-link" href="https://doi.org/10.1234/example">10.1234/example</a>',

  // Buttons
  'button': '<button class="button">Click me</button>',
  'toggle-button': '<button class="toggle-button" aria-pressed="false">Toggle</button>',
  'switch-button': '<button class="switch-button" role="switch" aria-checked="false">Dark mode</button>',
  'clipboard-copy-button': '<button class="clipboard-copy-button">Copy to clipboard</button>',
  'hamburger-menu': '<button class="hamburger-menu" aria-expanded="false" aria-label="Menu">\u2630</button>',
  'slider-button': '<button class="slider-button">Slide to confirm</button>',
  'timer-button': '<button class="timer-button">Auto-click in 5s</button>',

  // Input special cases
  'button-input': '<input class="button-input" type="button" value="Click" />',
  'submit-input': '<input class="submit-input" type="submit" value="Submit" />',
  'reset-input': '<input class="reset-input" type="reset" value="Reset" />',
  'image-input': '<input class="image-input" type="image" alt="Submit" />',
  'hidden-input': '<input class="hidden-input" type="hidden" value="secret" />',
  'checkbox-input': '<label class="label" for="demo-input"><input class="checkbox-input" type="checkbox" id="demo-input" checked aria-label="Checkbox input" /> Checkbox</label>',
  'radio-input': '<label class="label" for="demo-input"><input class="radio-input" type="radio" id="demo-input" aria-label="Radio input" /> Radio</label>',

  // Bars
  'menu-bar': '<div class="menu-bar" role="menubar"><button class="menu-bar-button" role="menuitem">File</button><button class="menu-bar-button" role="menuitem">Edit</button></div>',
  'tab-bar': '<div class="tab-bar" role="tablist"><button class="tab-bar-button" role="tab" aria-selected="true">Tab 1</button><button class="tab-bar-button" role="tab">Tab 2</button></div>',
  'task-bar': '<div class="task-bar" role="toolbar" aria-label="Tasks"><button class="task-bar-button">New</button><button class="task-bar-button">Open</button></div>',
  'tool-bar': '<div class="tool-bar" role="toolbar" aria-label="Tools"><button class="tool-bar-button">Bold</button><button class="tool-bar-button">Italic</button></div>',
  'menu-bar-button': '<button class="menu-bar-button" role="menuitem">File</button>',
  'tab-bar-button': '<button class="tab-bar-button" role="tab">Tab</button>',
  'task-bar-button': '<button class="task-bar-button">Task</button>',
  'tool-bar-button': '<button class="tool-bar-button">Tool</button>',

  // Pickers
  'five-star-rating-picker': '<div class="five-star-rating-picker" role="radiogroup" aria-label="Rating"><button class="five-star-rating-picker-button" role="radio" aria-checked="false">\u2605</button><button class="five-star-rating-picker-button" role="radio" aria-checked="false">\u2605</button><button class="five-star-rating-picker-button" role="radio" aria-checked="true">\u2605</button><button class="five-star-rating-picker-button" role="radio" aria-checked="false">\u2605</button><button class="five-star-rating-picker-button" role="radio" aria-checked="false">\u2605</button></div>',
  'five-star-rating-picker-button': '<button class="five-star-rating-picker-button" role="radio" aria-checked="false">\u2605</button>',
  'five-face-rating-picker': '<div class="five-face-rating-picker" role="radiogroup" aria-label="Rating"><button class="five-face-rating-picker-button" role="radio" aria-checked="false">\ud83d\ude21</button><button class="five-face-rating-picker-button" role="radio" aria-checked="false">\ud83d\ude1f</button><button class="five-face-rating-picker-button" role="radio" aria-checked="false">\ud83d\ude10</button><button class="five-face-rating-picker-button" role="radio" aria-checked="true">\ud83d\ude0a</button><button class="five-face-rating-picker-button" role="radio" aria-checked="false">\ud83d\ude0d</button></div>',
  'five-face-rating-picker-button': '<button class="five-face-rating-picker-button" role="radio" aria-checked="false">\ud83d\ude0a</button>',
  'net-promoter-score-picker': '<div class="net-promoter-score-picker" role="radiogroup" aria-label="NPS"><button class="net-promoter-score-picker-button" role="radio">0</button><button class="net-promoter-score-picker-button" role="radio">1</button><button class="net-promoter-score-picker-button" role="radio">2</button><button class="net-promoter-score-picker-button" role="radio">3</button><button class="net-promoter-score-picker-button" role="radio">4</button><button class="net-promoter-score-picker-button" role="radio">5</button><button class="net-promoter-score-picker-button" role="radio">6</button><button class="net-promoter-score-picker-button" role="radio">7</button><button class="net-promoter-score-picker-button" role="radio" aria-checked="true">8</button><button class="net-promoter-score-picker-button" role="radio">9</button><button class="net-promoter-score-picker-button" role="radio">10</button></div>',
  'net-promoter-score-picker-button': '<button class="net-promoter-score-picker-button" role="radio">8</button>',
  'red-amber-green-picker': '<div class="red-amber-green-picker" role="radiogroup" aria-label="Status"><button class="red-amber-green-picker-button" role="radio">Red</button><button class="red-amber-green-picker-button" role="radio">Amber</button><button class="red-amber-green-picker-button" role="radio" aria-checked="true">Green</button></div>',
  'red-amber-green-picker-button': '<button class="red-amber-green-picker-button" role="radio">Green</button>',
  'red-orange-yellow-green-blue-picker': '<div class="red-orange-yellow-green-blue-picker" role="radiogroup" aria-label="Status"><button class="red-orange-yellow-green-blue-picker-button" role="radio">Red</button><button class="red-orange-yellow-green-blue-picker-button" role="radio">Orange</button><button class="red-orange-yellow-green-blue-picker-button" role="radio">Yellow</button><button class="red-orange-yellow-green-blue-picker-button" role="radio" aria-checked="true">Green</button><button class="red-orange-yellow-green-blue-picker-button" role="radio">Blue</button></div>',
  'red-orange-yellow-green-blue-picker-button': '<button class="red-orange-yellow-green-blue-picker-button" role="radio">Green</button>',
  'color-picker': '<div class="color-picker" aria-label="Color picker"><button class="color-picker-button" style="background:#ff0000" aria-label="Red"></button><button class="color-picker-button" style="background:#00ff00" aria-label="Green"></button><button class="color-picker-button" style="background:#0000ff" aria-label="Blue"></button></div>',
  'color-picker-button': '<button class="color-picker-button" style="background:#ff0000" aria-label="Red"></button>',
  'theme-picker': '<div class="theme-picker" role="radiogroup" aria-label="Theme"><button class="theme-picker-button" role="radio" aria-checked="true">Light</button><button class="theme-picker-button" role="radio">Dark</button></div>',
  'theme-picker-button': '<button class="theme-picker-button" role="radio">Light</button>',
  'emoji-character-picker': '<div class="emoji-character-picker" aria-label="Emoji picker"><button>\ud83d\ude00</button><button>\u2764\ufe0f</button><button>\ud83d\udc4d</button><button>\ud83c\udf89</button></div>',
  'calendar-range-picker': '<div class="calendar-range-picker" aria-label="Date range"><input type="date" aria-label="Start date" value="2026-01-01" /> to <input type="date" aria-label="End date" value="2026-01-31" /></div>',

  // Views
  'five-star-rating-view': '<span class="five-star-rating-view" role="img" aria-label="3 out of 5 stars">\u2605\u2605\u2605\u2606\u2606</span>',
  'five-face-rating-view': '<span class="five-face-rating-view" role="img" aria-label="Satisfied">\ud83d\ude0a</span>',
  'net-promoter-score-view': '<span class="net-promoter-score-view" role="img" aria-label="NPS: 8">8</span>',
  'red-amber-green-view': '<span class="red-amber-green-view" role="img" aria-label="Status: Green">Green</span>',
  'red-orange-yellow-green-blue-view': '<span class="red-orange-yellow-green-blue-view" role="img" aria-label="Status: Green">Green</span>',
  'theme-view': '<span class="theme-view" role="img" aria-label="Current theme: Light">Light</span>',
  'postal-code-view': '<span class="postal-code-view">SW1A 1AA</span>',
  'measurement-instance-view': '<span class="measurement-instance-view">100 cm</span>',
  'measurement-system-view': '<span class="measurement-system-view">Metric</span>',
  'measurement-unit-view': '<span class="measurement-unit-view">cm</span>',
  'united-kingdom-national-health-service-number-view': '<span class="united-kingdom-national-health-service-number-view">485 777 3456</span>',
  'united-states-social-security-number-view': '<span class="united-states-social-security-number-view">123-45-6789</span>',

  // Tables (root)
  'table': '<table class="table" aria-label="Table"><thead class="table-head"><tr class="table-row"><th class="table-th">Name</th><th class="table-th">Value</th></tr></thead><tbody class="table-body"><tr class="table-row"><td class="table-td">Item 1</td><td class="table-td">100</td></tr></tbody></table>',
  'data-table': '<table class="data-table" aria-label="Data table"><thead class="data-table-head"><tr class="data-table-row"><th class="data-table-th">Name</th><th class="data-table-th">Value</th></tr></thead><tbody class="data-table-body"><tr class="data-table-row"><td class="data-table-td">Item 1</td><td class="data-table-td">100</td></tr></tbody></table>',
  'calendar-table': '<table class="calendar-table" aria-label="Calendar"><thead class="calendar-table-head"><tr class="calendar-table-row"><th class="calendar-table-th">Mon</th><th class="calendar-table-th">Tue</th><th class="calendar-table-th">Wed</th></tr></thead><tbody class="calendar-table-body"><tr class="calendar-table-row"><td class="calendar-table-td">1</td><td class="calendar-table-td">2</td><td class="calendar-table-td">3</td></tr></tbody></table>',
  'gantt-table': '<table class="gantt-table" aria-label="Gantt chart"><thead class="gantt-table-head"><tr class="gantt-table-row"><th class="gantt-table-th">Task</th><th class="gantt-table-th">Timeline</th></tr></thead><tbody class="gantt-table-body"><tr class="gantt-table-row"><td class="gantt-table-td">Design</td><td class="gantt-table-td">Jan-Feb</td></tr></tbody></table>',
  'kanban-table': '<table class="kanban-table" aria-label="Kanban board"><thead class="kanban-table-head"><tr class="kanban-table-row"><th class="kanban-table-th">To Do</th><th class="kanban-table-th">In Progress</th><th class="kanban-table-th">Done</th></tr></thead><tbody class="kanban-table-body"><tr class="kanban-table-row"><td class="kanban-table-td">Task 1</td><td class="kanban-table-td">Task 2</td><td class="kanban-table-td">Task 3</td></tr></tbody></table>',

  // Table sub-elements
  'table-head': '<thead class="table-head"><tr class="table-row"><th class="table-th">Column</th></tr></thead>',
  'table-body': '<tbody class="table-body"><tr class="table-row"><td class="table-td">Data</td></tr></tbody>',
  'table-foot': '<tfoot class="table-foot"><tr class="table-row"><td class="table-td">Footer</td></tr></tfoot>',
  'table-row': '<tr class="table-row"><td class="table-td">Cell 1</td><td class="table-td">Cell 2</td></tr>',
  'table-th': '<th class="table-th">Column heading</th>',
  'table-td': '<td class="table-td">Cell data</td>',
  'data-table-head': '<thead class="data-table-head"><tr class="data-table-row"><th class="data-table-th">Column</th></tr></thead>',
  'data-table-body': '<tbody class="data-table-body"><tr class="data-table-row"><td class="data-table-td">Data</td></tr></tbody>',
  'data-table-foot': '<tfoot class="data-table-foot"><tr class="data-table-row"><td class="data-table-td">Footer</td></tr></tfoot>',
  'data-table-row': '<tr class="data-table-row"><td class="data-table-td">Cell 1</td><td class="data-table-td">Cell 2</td></tr>',
  'data-table-th': '<th class="data-table-th">Column heading</th>',
  'data-table-td': '<td class="data-table-td">Cell data</td>',
  'calendar-table-head': '<thead class="calendar-table-head"><tr class="calendar-table-row"><th class="calendar-table-th">Day</th></tr></thead>',
  'calendar-table-body': '<tbody class="calendar-table-body"><tr class="calendar-table-row"><td class="calendar-table-td">1</td></tr></tbody>',
  'calendar-table-foot': '<tfoot class="calendar-table-foot"><tr class="calendar-table-row"><td class="calendar-table-td">Total</td></tr></tfoot>',
  'calendar-table-row': '<tr class="calendar-table-row"><td class="calendar-table-td">1</td><td class="calendar-table-td">2</td></tr>',
  'calendar-table-th': '<th class="calendar-table-th">Day</th>',
  'calendar-table-td': '<td class="calendar-table-td">15</td>',
  'gantt-table-head': '<thead class="gantt-table-head"><tr class="gantt-table-row"><th class="gantt-table-th">Task</th></tr></thead>',
  'gantt-table-body': '<tbody class="gantt-table-body"><tr class="gantt-table-row"><td class="gantt-table-td">Design</td></tr></tbody>',
  'gantt-table-foot': '<tfoot class="gantt-table-foot"><tr class="gantt-table-row"><td class="gantt-table-td">Summary</td></tr></tfoot>',
  'gantt-table-row': '<tr class="gantt-table-row"><td class="gantt-table-td">Task</td><td class="gantt-table-td">Timeline</td></tr>',
  'gantt-table-th': '<th class="gantt-table-th">Task</th>',
  'gantt-table-td': '<td class="gantt-table-td">Design phase</td>',
  'kanban-table-head': '<thead class="kanban-table-head"><tr class="kanban-table-row"><th class="kanban-table-th">Status</th></tr></thead>',
  'kanban-table-body': '<tbody class="kanban-table-body"><tr class="kanban-table-row"><td class="kanban-table-td">Task</td></tr></tbody>',
  'kanban-table-foot': '<tfoot class="kanban-table-foot"><tr class="kanban-table-row"><td class="kanban-table-td">Total</td></tr></tfoot>',
  'kanban-table-row': '<tr class="kanban-table-row"><td class="kanban-table-td">Task 1</td></tr>',
  'kanban-table-th': '<th class="kanban-table-th">Status</th>',
  'kanban-table-td': '<td class="kanban-table-td">Task item</td>',

  // Selects
  'select': '<select class="select" aria-label="Choose option"><option class="option" value="1">Option 1</option><option class="option" value="2">Option 2</option><option class="option" value="3">Option 3</option></select>',
  'theme-select': '<select class="theme-select" aria-label="Choose theme"><option class="theme-select-option" value="light">Light</option><option class="theme-select-option" value="dark">Dark</option></select>',
  'option': '<option class="option" value="example">Example option</option>',
  'theme-select-option': '<option class="theme-select-option" value="light">Light</option>',

  // Menus
  'context-menu': '<div class="context-menu" role="menu"><div class="context-menu-item" role="menuitem">Cut</div><div class="context-menu-item" role="menuitem">Copy</div><div class="context-menu-item" role="menuitem">Paste</div></div>',
  'context-menu-item': '<div class="context-menu-item" role="menuitem">Menu action</div>',
  'dropdown-menu': '<div class="dropdown-menu" role="menu"><div role="menuitem">Option 1</div><div role="menuitem">Option 2</div></div>',
  'menu': '<div class="menu" role="menu"><div class="menu-item" role="menuitem">Action 1</div><div class="menu-item" role="menuitem">Action 2</div></div>',
  'menu-item': '<div class="menu-item" role="menuitem">Action</div>',
  'tree-menu': '<div class="tree-menu" role="tree"><div role="treeitem">Item 1</div><div role="treeitem">Item 2</div></div>',
  'navigation-menu': '<nav class="navigation-menu" aria-label="Main"><ul><li><a href="#">Home</a></li><li><a href="#">About</a></li><li><a href="#">Contact</a></li></ul></nav>',

  // Container/layout
  'card': '<div class="card"><h3>Card Title</h3><p>Card content goes here.</p></div>',
  'panel': '<div class="panel"><h3>Panel Heading</h3><p>Panel content.</p></div>',
  'dialog': '<dialog class="dialog" open aria-label="Example dialog"><p>Dialog content</p><button class="button">Close</button></dialog>',
  'alert-dialog': '<dialog class="alert-dialog" open role="alertdialog" aria-label="Confirmation"><p>Are you sure?</p><button class="button">OK</button></dialog>',
  'drawer': '<div class="drawer" role="dialog" aria-label="Drawer"><p>Drawer content</p></div>',
  'popover': '<div class="popover" role="dialog"><p>Popover content</p></div>',
  'tooltip': '<div class="tooltip" role="tooltip">Helpful tip text</div>',
  'hero': '<section class="hero"><h2>Welcome to Lily</h2><p>A design system for everyone.</p></section>',
  'banner': '<div class="banner" role="banner">Important announcement</div>',
  'super-banner': '<div class="super-banner" role="alert">Critical system message</div>',
  'notification': '<div class="notification" role="status">You have new messages</div>',
  'alert': '<div class="alert" role="alert">This is an alert message</div>',
  'toast': '<div class="toast" role="status">Action completed successfully</div>',

  // Form elements
  'form': '<form class="form" aria-label="Example form"><div class="field"><label class="label">Name</label><input class="text-input" type="text" /></div><button class="button" type="submit">Submit</button></form>',
  'field': '<div class="field"><label class="label" for="demo-field">Field label</label><input class="text-input" type="text" id="demo-field" /><span class="hint">Hint text</span></div>',
  'fieldset': '<fieldset class="fieldset"><legend>Group label</legend><div class="field"><label class="label"><input type="checkbox" /> Option A</label></div></fieldset>',
  'label': '<label class="label" for="demo">Form label</label>',
  'hint': '<span class="hint">Enter your full name as shown on your ID</span>',
  'error-message': '<span class="error-message" role="alert">This field is required</span>',
  'error-summary': '<div class="error-summary" role="alert"><h3>There are errors</h3><ul><li>Name is required</li><li>Email is invalid</li></ul></div>',

  // Text/display elements
  'badge': '<span class="badge">New</span>',
  'tag': '<span class="tag">Category</span>',
  'flair': '<span class="flair">Featured</span>',
  'kbd': '<kbd class="kbd">Ctrl</kbd> + <kbd class="kbd">S</kbd>',
  'code': '<code class="code">const x = 42;</code>',
  'code-block': '<pre class="code-block"><code>function hello() {\n  return "world";\n}</code></pre>',
  'caption': '<caption class="caption">Table caption text</caption>',
  'citation': '<cite class="citation">The Design of Everyday Things</cite>',
  'character': '<span class="character">A</span>',
  'character-counter': '<span class="character-counter">42/100</span>',
  'emoji': '<span class="emoji" role="img" aria-label="thumbs up">\ud83d\udc4d</span>',
  'inset-text': '<div class="inset-text">Important: This information is for guidance only.</div>',
  'separator': '<hr class="separator" />',
  'figure': '<figure class="figure"><div style="background:#e5e7eb;height:150px;display:flex;align-items:center;justify-content:center;">Image placeholder</div><figcaption>Figure caption</figcaption></figure>',
  'image': '<img class="image" alt="Placeholder image" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'100\'%3E%3Crect fill=\'%23e5e7eb\' width=\'200\' height=\'100\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23666\'%3EImage%3C/text%3E%3C/svg%3E" />',
  'icon': '<span class="icon" aria-hidden="true">\u2699\ufe0f</span>',
  'loading': '<div class="loading" aria-label="Loading" role="status">Loading...</div>',
  'skeleton': '<div class="skeleton" aria-hidden="true" style="height:1em;background:#e5e7eb;border-radius:4px;"></div>',
  'progress': '<progress class="progress" value="60" max="100" aria-label="Progress">60%</progress>',
  'progress-circle': '<div class="progress-circle" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" aria-label="75%">75%</div>',
  'progress-spinner': '<div class="progress-spinner" role="status" aria-label="Loading">\u27f3</div>',
  'meter': '<meter class="meter" value="0.7" min="0" max="1" aria-label="Meter">70%</meter>',

  // Layout
  'header': '<header class="header" aria-label="Page header"><h2>Page Title</h2></header>',
  'footer': '<footer class="footer" aria-label="Page footer"><p>\u00a9 2026 Lily Design System</p></footer>',
  'sidebar': '<aside class="sidebar" aria-label="Sidebar"><nav><ul><li>Nav item 1</li><li>Nav item 2</li></ul></nav></aside>',
  'grail-layout': '<div class="grail-layout"><header class="grail-layout-top-header">Header</header><aside class="grail-layout-left-aside">Left sidebar</aside><main class="grail-layout-center-main">Main content</main><aside class="grail-layout-right-aside">Right sidebar</aside><footer class="grail-layout-bottom-footer">Footer</footer></div>',
  'grail-layout-top-header': '<header class="grail-layout-top-header">Header</header>',
  'grail-layout-left-aside': '<aside class="grail-layout-left-aside">Left sidebar</aside>',
  'grail-layout-center-main': '<main class="grail-layout-center-main">Main content</main>',
  'grail-layout-right-aside': '<aside class="grail-layout-right-aside">Right sidebar</aside>',
  'grail-layout-bottom-footer': '<footer class="grail-layout-bottom-footer">Footer</footer>',

  // Other specific components
  'details': '<details class="details"><summary>Click to expand</summary><p>Hidden content revealed here.</p></details>',
  'collapsible': '<div class="collapsible"><button aria-expanded="false">Show more</button><div hidden>Collapsed content</div></div>',
  'expander': '<div class="expander"><button aria-expanded="true">Show less</button><div>Expanded content visible here.</div></div>',
  'editable': '<div class="editable" contenteditable="true">Click to edit this text</div>',
  'diff': '<div class="diff" role="group" aria-label="Comparison"><div>Original text</div><div>Modified text</div></div>',
  'avatar': '<div class="avatar" role="img" aria-label="User avatar">JD</div>',
  'avatar-image': '<img class="avatar-image" alt="User photo" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'20\' fill=\'%23005eb8\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'white\' font-size=\'16\'%3EJD%3C/text%3E%3C/svg%3E" />',
  'avatar-text': '<span class="avatar-text">JD</span>',
  'avatar-group': '<div class="avatar-group"><div class="avatar">AB</div><div class="avatar">CD</div><div class="avatar">EF</div></div>',
  'review-date': '<div class="review-date"><span>Last reviewed: </span><time datetime="2026-01-15">15 January 2026</time></div>',
  'date-range': '<div class="date-range"><time datetime="2026-01-01">1 Jan 2026</time> \u2014 <time datetime="2026-12-31">31 Dec 2026</time></div>',
  'ai-label': '<span class="ai-label" aria-label="AI-generated content">AI</span>',
  'qr-code': '<div class="qr-code" role="img" aria-label="QR Code">\u25a3 QR Code \u25a3</div>',
  'sparkline': '<span class="sparkline" role="img" aria-label="Trend: increasing">\u2581\u2582\u2583\u2585\u2587</span>',
  'care-card': '<div class="care-card"><h3>Urgent care</h3><p>Contact your GP within 48 hours.</p></div>',
  'information-callout': '<div class="information-callout"><h3>Information</h3><p>This is helpful information.</p></div>',
  'warning-callout': '<div class="warning-callout"><h3>Warning</h3><p>Please be aware of this important warning.</p></div>',
  'medical-record-red-box': '<div class="medical-record-red-box"><h3>Critical</h3><p>Allergic to penicillin.</p></div>',
  'call-to-action': '<div class="call-to-action"><h3>Get started</h3><p>Sign up for free today.</p><a href="#">Sign up</a></div>',
  'comment': '<article class="comment"><header>Jane Doe \u2014 <time>2 hours ago</time></header><p>Great work on this!</p></article>',
  'footnote': '<span class="footnote"><sup><a href="#fn1">[1]</a></sup></span>',
  'event': '<article class="event"><h3>Annual Conference</h3><time datetime="2026-06-15">15 June 2026</time><p>Join us for our annual event.</p></article>',
  'organization': '<article class="organization"><h3>Lily Foundation</h3><p>A non-profit design organization.</p></article>',
  'person': '<article class="person"><h3>Jane Doe</h3><p>Lead Designer</p></article>',
  'place': '<article class="place"><h3>London, UK</h3><p>Design headquarters.</p></article>',
  'tour': '<div class="tour" role="dialog" aria-label="Tour"><p>Welcome! Let me show you around.</p><button class="button">Next</button></div>',
  'screen-reader-span': '<span class="screen-reader-span">Additional context for screen readers</span>',
  'scroll-area': '<div class="scroll-area" style="max-height:100px;overflow:auto"><p>Scrollable content area with potentially long content.</p></div>',
  'scroll-bar': '<div class="scroll-bar" role="scrollbar" aria-valuenow="50"></div>',
  'aspect-ratio-container': '<div class="aspect-ratio-container" style="aspect-ratio:16/9;background:#e5e7eb;display:flex;align-items:center;justify-content:center;">16:9</div>',
  'resizable': '<div class="resizable" style="resize:both;overflow:auto;border:1px solid #d1d5db;padding:1rem;">Resize me</div>',
  'file-upload': '<div class="file-upload"><p>Drag and drop files here or click to browse</p></div>',
  'file-dialog': '<dialog class="file-dialog" open><p>Select a file</p></dialog>',
  'file-manager': '<div class="file-manager"><ul><li>\ud83d\udcc1 Documents</li><li>\ud83d\udcc1 Images</li><li>\ud83d\udcc4 readme.txt</li></ul></div>',
  'signature-pad': '<div class="signature-pad" role="img" aria-label="Signature area" style="border:1px solid #d1d5db;height:100px;display:flex;align-items:center;justify-content:center;">Sign here</div>',
  'beach-ball': '<div class="beach-ball" role="img" aria-label="Beach ball">\ud83c\udfd0</div>',
  'popup': '<div class="popup" role="dialog"><p>Popup content</p></div>',
  'sheet': '<div class="sheet" role="dialog" aria-label="Sheet"><p>Sheet panel content</p></div>',
  'floating-panel': '<div class="floating-panel"><p>Floating panel content</p></div>',
  'slide-out-drawer': '<div class="slide-out-drawer" role="dialog" aria-label="Drawer"><p>Slide-out drawer</p></div>',
  'hover-card': '<div class="hover-card"><p>Card shown on hover</p></div>',
  'carousel': '<div class="carousel" role="region" aria-label="Carousel"><div>Slide 1</div></div>',
  'tile': '<div class="tile"><h3>Tile Title</h3><p>Tile content</p></div>',
  'listbox': '<div class="listbox" role="listbox" aria-label="Options"><div role="option" aria-selected="true">Option A</div><div role="option">Option B</div></div>',
  'combobox': '<div class="combobox"><input type="text" role="combobox" aria-expanded="false" aria-label="Search" /><ul role="listbox" hidden><li role="option">Apple</li><li role="option">Banana</li></ul></div>',
  'command': '<div class="command" role="dialog" aria-label="Command palette"><input type="search" placeholder="Type a command..." /><ul role="listbox"><li role="option">Open file</li><li role="option">Save</li></ul></div>',
  'sonner': '<div class="sonner" aria-live="polite"><div class="toast" role="status">Toast message</div></div>',
  'segment-group': '<div class="segment-group" role="radiogroup" aria-label="View"><button class="segment-group-item" role="radio" aria-checked="true">Grid</button><button class="segment-group-item" role="radio">List</button></div>',
  'segment-group-item': '<button class="segment-group-item" role="radio" aria-checked="true">Grid</button>',
  'toggle-group': '<div class="toggle-group" role="group" aria-label="Formatting"><button class="toggle-button" aria-pressed="true">B</button><button class="toggle-button" aria-pressed="false">I</button></div>',
  'checkbox-group': '<div class="checkbox-group" role="group" aria-label="Options"><label><input type="checkbox" checked /> Option A</label><label><input type="checkbox" /> Option B</label></div>',
  'radio-group': '<div class="radio-group" role="radiogroup" aria-label="Choice"><label><input type="radio" name="demo" checked /> Yes</label><label><input type="radio" name="demo" /> No</label></div>',
  'dial': '<div class="dial" role="slider" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-label="Volume">50</div>',
  'dial-group': '<div class="dial-group"><div class="dial" role="slider" aria-valuenow="30" aria-label="Bass">30</div><div class="dial" role="slider" aria-valuenow="70" aria-label="Treble">70</div></div>',
  'slider': '<div class="slider" role="slider" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" aria-label="Value">50</div>',
  'splitter': '<div class="splitter" role="separator" aria-label="Resize panels"></div>',
  'timer': '<div class="timer" role="timer" aria-label="Time remaining">05:00</div>',
  'data-filter-form': '<form class="data-filter-form" aria-label="Filter"><label>Status: <select><option>All</option><option>Active</option></select></label><button type="submit">Apply</button></form>',
  'editable-form': '<form class="editable-form" aria-label="Edit"><input type="text" value="Editable content" /><button type="submit">Save</button></form>',
  'select-with-extras': '<div class="select-with-extras"><input type="text" placeholder="Search..." /><select><option>Option 1</option><option>Option 2</option></select></div>',
  'currency-input': '<label class="label" for="demo-currency">Amount</label><input class="currency-input" type="text" id="demo-currency" value="$1,234.56" />',
  'tag-group': '<div class="tag-group"><span class="tag">Design</span><span class="tag">Development</span><span class="tag">Testing</span></div>',
  'tag-input': '<div class="tag-input"><span class="tag">React <button aria-label="Remove React">\u00d7</button></span><input type="text" placeholder="Add tag..." /></div>',
  'date-field': '<div class="date-field" role="group" aria-label="Date"><input type="text" aria-label="Day" size="2" value="15" /> / <input type="text" aria-label="Month" size="2" value="03" /> / <input type="text" aria-label="Year" size="4" value="2026" /></div>',
  'time-picker-input': '<input class="time-picker-input" type="time" value="14:30" aria-label="Select time" />',
  'pin-input-div': '<div class="pin-input-div" role="group" aria-label="PIN code"><input type="text" maxlength="1" size="1" aria-label="Digit 1" /> <input type="text" maxlength="1" size="1" aria-label="Digit 2" /> <input type="text" maxlength="1" size="1" aria-label="Digit 3" /> <input type="text" maxlength="1" size="1" aria-label="Digit 4" /></div>',
  'password-input-or-text-input-div': '<div class="password-input-or-text-input-div"><input type="password" aria-label="Password" /><button type="button">Show</button></div>',
  'text-area-input': '<textarea class="text-area-input" aria-label="Message" rows="4">Type your message here...</textarea>',
  'input': '<input class="input" aria-label="Input" />',
  'angle-slider-range-input': '<input class="angle-slider-range-input" type="range" min="0" max="360" value="90" aria-label="Angle" />',
  'image-file-input': '<input class="image-file-input" type="file" accept="image/*" aria-label="Choose image" />',
  'postal-code-input': '<input class="postal-code-input" type="text" value="SW1A 1AA" aria-label="Postal code" />',
  'measurement-instance-input': '<div class="measurement-instance-input"><input type="number" value="100" aria-label="Value" /> <select aria-label="Unit"><option>cm</option><option>m</option></select></div>',
  'measurement-system-input': '<select class="measurement-system-input" aria-label="System"><option>Metric</option><option>Imperial</option></select>',
  'measurement-unit-input': '<select class="measurement-unit-input" aria-label="Unit"><option>cm</option><option>m</option><option>km</option></select>',
  'united-kingdom-national-health-service-number-input': '<input class="united-kingdom-national-health-service-number-input" type="text" value="485 777 3456" aria-label="NHS number" />',
  'united-states-social-security-number-input': '<input class="united-states-social-security-number-input" type="text" value="123-45-6789" aria-label="SSN" />',
  'chat-message': '<article class="chat-message" aria-label="Message from Alice"><p>Hello, how can I help?</p></article>',

  // Mockups
  'mockup-browser': '<div class="mockup-browser" role="img" aria-label="a box area that looks like a web browser"><div style="padding:1rem;background:#f3f4f6;border:2px solid #d1d5db;border-radius:8px;text-align:center;min-height:100px;">MockupBrowser Preview</div></div>',
  'mockup-laptop': '<div class="mockup-laptop" role="img" aria-label="a box area that looks like a laptop computer"><div style="padding:1rem;background:#f3f4f6;border:2px solid #d1d5db;border-radius:8px;text-align:center;min-height:100px;">MockupLaptop Preview</div></div>',
  'mockup-phone-portrait': '<div class="mockup-phone-portrait" role="img" aria-label="a box area that looks like a mobile phone"><div style="padding:1rem;background:#f3f4f6;border:2px solid #d1d5db;border-radius:8px;text-align:center;min-height:100px;">MockupPhonePortrait Preview</div></div>',
  'mockup-tablet-landscape': '<div class="mockup-tablet-landscape" role="img" aria-label="a box area that looks like a tablet computer in landscape mode"><div style="padding:1rem;background:#f3f4f6;border:2px solid #d1d5db;border-radius:8px;text-align:center;min-height:100px;">MockupTabletLandscape Preview</div></div>',
  'mockup-tablet-portrait': '<div class="mockup-tablet-portrait" role="img" aria-label="a box area that looks like a tablet computer in portrait mode"><div style="padding:1rem;background:#f3f4f6;border:2px solid #d1d5db;border-radius:8px;text-align:center;min-height:100px;">MockupTabletPortrait Preview</div></div>',
  'mockup-shell': '<div class="mockup-shell" role="img" aria-label="a box area that looks like a terminal shell"><div style="padding:1rem;background:#f3f4f6;border:2px solid #d1d5db;border-radius:8px;text-align:center;min-height:100px;">MockupShell Preview</div></div>',
  'mockup-watch': '<div class="mockup-watch" role="img" aria-label="a box area that looks like a smart watch"><div style="padding:1rem;background:#f3f4f6;border:2px solid #d1d5db;border-radius:8px;text-align:center;min-height:100px;">MockupWatch Preview</div></div>',
  'mockup-window': '<div class="mockup-window" role="img" aria-label="a box area that looks like a desktop window"><div style="padding:1rem;background:#f3f4f6;border:2px solid #d1d5db;border-radius:8px;text-align:center;min-height:100px;">MockupWindow Preview</div></div>',
};

function generateDemo(slug, name, description) {
  // Check explicit demos first
  if (explicitDemos[slug]) {
    return explicitDemos[slug];
  }

  // Standard input types
  if (inputTypeMap[slug]) {
    const inputType = inputTypeMap[slug];
    if (inputType === 'checkbox') {
      return `<label class="label" for="demo-input"><input class="${slug}" type="checkbox" id="demo-input" checked aria-label="Checkbox input" /> Checkbox</label>`;
    }
    if (inputType === 'radio') {
      return `<label class="label" for="demo-input"><input class="${slug}" type="radio" id="demo-input" aria-label="Radio input" /> Radio</label>`;
    }
    if (inputType === 'hidden') {
      return `<input class="${slug}" type="hidden" value="secret" />`;
    }
    return `<label class="label" for="demo-input">Label</label><input class="${slug}" type="${inputType}" id="demo-input" aria-label="${name}" />`;
  }

  // Generic *-input fallback
  if (slug.endsWith('-input')) {
    return `<label class="label" for="demo-input">Label</label><input class="${slug}" id="demo-input" aria-label="${description}" />`;
  }

  // Mockup pattern
  if (slug.startsWith('mockup-')) {
    return `<div class="${slug}" role="img" aria-label="${description}"><div style="padding:1rem;background:#f3f4f6;border:2px solid #d1d5db;border-radius:8px;text-align:center;min-height:100px;">${name} Preview</div></div>`;
  }

  // Fallback
  return `<div class="${slug}" aria-label="${description}">${name}</div>`;
}

// Generate all demos
const demos = {};
for (const { slug, name, description } of components) {
  demos[slug] = generateDemo(slug, name, description);
}

// Output
const entries = Object.entries(demos)
  .map(([slug, html]) => {
    const escaped = html.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `  '${slug}': '${escaped}'`;
  })
  .join(',\n');

process.stdout.write(`export const componentDemos: Record<string, string> = {\n${entries},\n};\n`);
