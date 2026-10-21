import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TaskList component -->\n<!--\n  Description: an ordered list of task list items\n  HTML tag: <ol>\n  CSS class: task-list\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <ol class=\"task-list\" aria-label=\"Example\">\n      ...\n    </ol>\n-->\n\n<ol\n  class=\"task-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides list items -->\n</ol>";

const meta = {
  title: 'Headless/Task List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
