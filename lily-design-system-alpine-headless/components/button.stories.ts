import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Button component -->\n<!--\n  Description: a generic clickable button element\n  HTML tag: <button>\n  CSS class: button\n  Keyboard: Tab to focus, Enter or Space to activate\n  Accessibility: Implicit button role, aria-label for accessible name\n  Usage:\n    <button class=\"button\" aria-label=\"Example\">\n      ...\n    </button>\n-->\n\n<button\n  class=\"button\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
