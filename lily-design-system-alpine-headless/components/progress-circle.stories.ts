import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ProgressCircle component -->\n<!--\n  Description: a circular progress indicator\n  HTML tag: <div>\n  CSS class: progress-circle\n  Keyboard: None (passive element)\n  Accessibility: role=\"progressbar\", aria-label for accessible name\n  Usage:\n    <div class=\"progress-circle\" role=\"progressbar\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"progress-circle\"\n  role=\"progressbar\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Progress Circle',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
