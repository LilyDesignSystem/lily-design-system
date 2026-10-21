import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div x-data=\"lilyDialog(false)\">\n  <button class=\"dialog-trigger\" x-bind=\"trigger\">\n    <!-- Consumer provides trigger content -->\n  </button>\n  <dialog class=\"dialog\" aria-label=\"\" x-bind=\"dialog\">\n    <!-- Consumer provides dialog content -->\n    <button class=\"dialog-close\" x-bind=\"closer\"><!-- Consumer provides label --></button>\n  </dialog>\n</div>";

const meta = {
  title: 'Headless/Dialog',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
