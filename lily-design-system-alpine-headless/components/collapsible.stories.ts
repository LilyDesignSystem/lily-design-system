import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"collapsible\" x-data=\"lilyCollapsible(false)\" x-bind=\"root\" aria-label=\"\">\n  <button class=\"collapsible-trigger\" x-bind=\"trigger\" aria-controls=\"collapsible-content-1\">\n    <!-- Consumer provides trigger label -->\n  </button>\n  <div class=\"collapsible-content\" id=\"collapsible-content-1\" x-bind=\"content\">\n    <!-- Consumer provides content -->\n  </div>\n</div>";

const meta = {
  title: 'Headless/Collapsible',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
