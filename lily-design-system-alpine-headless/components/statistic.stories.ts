import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"statistic\"\n  role=\"group\"\n  aria-label=\"\"\n>\n  <!-- Title: REQUIRED. The text label/heading for the statistic. -->\n  <div class=\"statistic-title\">\n    <!-- Consumer provides the title text -->\n  </div>\n\n  <!-- Value: REQUIRED. The pre-formatted numeric value text. -->\n  <div class=\"statistic-value\">\n    <!-- Optional prefix (e.g. currency symbol) -->\n    <span class=\"statistic-prefix\">\n      <!-- Consumer provides the prefix content (or remove this span if unused) -->\n    </span>\n\n    <!-- Consumer inserts the value text directly here -->\n\n    <!-- Optional suffix (e.g. unit or percentage sign) -->\n    <span class=\"statistic-suffix\">\n      <!-- Consumer provides the suffix content (or remove this span if unused) -->\n    </span>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Statistic',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
