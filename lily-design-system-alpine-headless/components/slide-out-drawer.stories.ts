import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div x-data=\"lilyOverlay(false)\">\n  <button class=\"slide-out-drawer-trigger\" x-bind=\"trigger\" aria-controls=\"slide-out-drawer-1\"><!-- Consumer provides trigger label --></button>\n  <div class=\"slide-out-drawer\" id=\"slide-out-drawer-1\" role=\"dialog\" aria-modal=\"true\" aria-label=\"\" tabindex=\"-1\" data-side=\"right\" x-bind=\"surface\">\n    <!-- Consumer provides content -->\n    <button class=\"slide-out-drawer-close\" x-bind=\"closer\"><!-- Consumer provides close label --></button>\n  </div>\n</div>";

const meta = {
  title: 'Headless/Slide Out Drawer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
