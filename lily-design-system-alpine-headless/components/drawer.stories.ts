import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div x-data=\"lilyOverlay(false)\">\n  <button class=\"drawer-trigger\" x-bind=\"trigger\" aria-controls=\"drawer-1\"><!-- Consumer provides trigger label --></button>\n  <div class=\"drawer\" id=\"drawer-1\" role=\"dialog\" aria-modal=\"true\" aria-label=\"\" tabindex=\"-1\" data-side=\"right\" x-bind=\"surface\">\n    <!-- Consumer provides content -->\n    <button class=\"drawer-close\" x-bind=\"closer\"><!-- Consumer provides close label --></button>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Drawer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
