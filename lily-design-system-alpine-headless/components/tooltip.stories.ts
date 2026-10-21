import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<span class=\"tooltip-wrapper\" x-data=\"lilyTooltip()\">\n  <button class=\"tooltip-trigger\" x-bind=\"trigger\" aria-describedby=\"tooltip-1\">\n    <!-- Consumer provides trigger content -->\n  </button>\n  <div class=\"tooltip\" id=\"tooltip-1\" x-bind=\"tooltip\">\n    <!-- Consumer provides content -->\n  </div>\n</span>";

const meta = {
  title: 'Headless/Tooltip',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
