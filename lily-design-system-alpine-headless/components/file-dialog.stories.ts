import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div x-data=\"lilyDialog(false)\">\n  <button class=\"file-dialog-trigger\" x-bind=\"trigger\"><!-- Consumer provides trigger label --></button>\n  <dialog class=\"file-dialog\" aria-label=\"\" x-bind=\"dialog\">\n    <!-- Consumer provides dialog content -->\n    <button class=\"file-dialog-close\" x-bind=\"closer\"><!-- Consumer provides label --></button>\n  </dialog>\n</div>";

const meta = {
  title: 'Headless/File Dialog',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
