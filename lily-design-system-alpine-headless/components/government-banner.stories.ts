import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<aside class=\"government-banner\" x-data=\"lilyCollapsible(false)\" x-bind=\"root\" aria-label=\"\">\n  <header class=\"government-banner-header\">\n    <span class=\"government-banner-text\"><!-- Consumer provides header text --></span>\n    <button class=\"government-banner-toggle\" x-bind=\"trigger\" aria-controls=\"government-banner-panel-1\">\n      <!-- Consumer provides the toggle label -->\n    </button>\n  </header>\n  <div class=\"government-banner-details\" id=\"government-banner-panel-1\" x-bind=\"content\">\n    <!-- Consumer provides details panel content -->\n  </div>\n</aside>";

const meta = {
  title: 'Headless/Government Banner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
