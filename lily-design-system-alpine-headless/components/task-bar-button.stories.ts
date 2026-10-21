import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TaskBarButton component -->\n<!--\n  Description: one item in a task bar\n  HTML tag: <button>\n  CSS class: task-bar-button\n  Keyboard: Tab to focus, Enter or Space to activate\n  Accessibility: Implicit button role, aria-label for accessible name\n  Usage:\n    <button class=\"task-bar-button\" aria-label=\"Example\">\n      ...\n    </button>\n-->\n\n<button\n  class=\"task-bar-button\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Task Bar Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
