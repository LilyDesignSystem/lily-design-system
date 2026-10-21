import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TransferList component -->\n<!--\n  Description: a dual list box for moving items between two lists\n\n  HTML tag: <div> with role=\"group\"\n  CSS class: transfer-list\n  Keyboard: None directly — consumer controls (typically a Listbox in each\n            section, plus action buttons in the middle) handle keyboard.\n  Accessibility:\n    - role=\"group\" with aria-label — the entire transfer-list is a labeled group.\n    - Each side is a <section> with aria-label so screen readers can navigate\n      directly to the source and target lists as landmarks.\n    - The middle \"transfer-list-actions\" region holds the move-right /\n      move-left buttons that the consumer supplies.\n\n  Behavior:\n    Renders a <div role=\"group\"> containing three regions:\n      - <section class=\"transfer-list-source\"  aria-label=\"…\"> — REQUIRED\n      - <div     class=\"transfer-list-actions\"             > — optional\n      - <section class=\"transfer-list-target\"  aria-label=\"…\"> — REQUIRED\n    Purely passive: no script.\n\n  Usage:\n    <div class=\"transfer-list\" role=\"group\" aria-label=\"Choose features\">\n      <section class=\"transfer-list-source\" aria-label=\"Available features\">\n        … consumer-supplied source listbox …\n      </section>\n      <div class=\"transfer-list-actions\">\n        … consumer-supplied move-right and move-left buttons …\n      </div>\n      <section class=\"transfer-list-target\" aria-label=\"Selected features\">\n        … consumer-supplied target listbox …\n      </section>\n    </div>\n-->\n\n<div\n  class=\"transfer-list\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Source list region: REQUIRED. -->\n  <section class=\"transfer-list-source\" aria-label=\"\">\n    <!-- Consumer provides the source list (typically a listbox) -->\n  </section>\n\n  <!-- Actions region: optional. Holds move-right / move-left buttons. -->\n  <div class=\"transfer-list-actions\">\n    <!-- Consumer provides the action buttons (or remove this div if unused) -->\n  </div>\n\n  <!-- Target list region: REQUIRED. -->\n  <section class=\"transfer-list-target\" aria-label=\"\">\n    <!-- Consumer provides the target list (typically a listbox) -->\n  </section>\n</div>";

const meta = {
  title: 'Headless/Transfer List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
