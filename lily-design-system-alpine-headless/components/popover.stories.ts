import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"popover\" x-data=\"lilyPopover(false)\" x-bind=\"root\" aria-label=\"\">\n  <button class=\"popover-trigger\" x-bind=\"trigger\" aria-controls=\"popover-panel-1\">\n    <!-- Consumer provides trigger content -->\n  </button>\n  <div class=\"popover-panel\" id=\"popover-panel-1\" role=\"dialog\" aria-label=\"\" x-bind=\"panel\">\n    <!-- Consumer provides content -->\n  </div>\n</div>";

const meta = {
  title: 'Headless/Popover',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
