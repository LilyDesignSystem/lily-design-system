import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TaskBar component -->\n<!--\n  Description: a horizontal bar of task shortcuts or actions\n  HTML tag: <div>\n  CSS class: task-bar\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"task-bar\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"task-bar\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Task Bar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
