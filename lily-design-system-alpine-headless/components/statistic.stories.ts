import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Statistic component -->\n<!--\n  Description: a numeric value display with title, prefix, and suffix\n\n  HTML tag: <div> with role=\"group\"\n  CSS class: statistic\n  Keyboard: None (passive display)\n  Accessibility:\n    - role=\"group\" — semantically groups the title and value as one unit\n    - aria-label — the accessible name. By default a consumer should set it\n      to \"{title}: {value}\" so screen readers announce both pieces together.\n      An explicit aria-label may override this default.\n\n  Behavior:\n    Renders a <div role=\"group\"> containing:\n      - <div class=\"statistic-title\">  — the label/heading text\n      - <div class=\"statistic-value\">  — the value, optionally wrapped between\n        a <span class=\"statistic-prefix\"> and a <span class=\"statistic-suffix\">.\n    Purely passive: no script.\n\n  Usage:\n    <div class=\"statistic\" role=\"group\" aria-label=\"Active users: 1,234\">\n      <div class=\"statistic-title\">Active users</div>\n      <div class=\"statistic-value\">\n        <span class=\"statistic-prefix\">$</span>\n        1,234\n        <span class=\"statistic-suffix\">USD</span>\n      </div>\n    </div>\n-->\n\n<div\n  class=\"statistic\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Title: REQUIRED. The text label/heading for the statistic. -->\n  <div class=\"statistic-title\">\n    <!-- Consumer provides the title text -->\n  </div>\n\n  <!-- Value: REQUIRED. The pre-formatted numeric value text. -->\n  <div class=\"statistic-value\">\n    <!-- Optional prefix (e.g. currency symbol) -->\n    <span class=\"statistic-prefix\">\n      <!-- Consumer provides the prefix content (or remove this span if unused) -->\n    </span>\n\n    <!-- Consumer inserts the value text directly here -->\n\n    <!-- Optional suffix (e.g. unit or percentage sign) -->\n    <span class=\"statistic-suffix\">\n      <!-- Consumer provides the suffix content (or remove this span if unused) -->\n    </span>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Statistic',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
