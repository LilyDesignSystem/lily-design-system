import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ToolBarButton component -->\n<!--\n  Description: one action button in a tool bar\n  HTML tag: <button>\n  CSS class: tool-bar-button\n  Keyboard: Tab to focus, Enter or Space to activate\n  Accessibility: Implicit button role, aria-label for accessible name\n  Usage:\n    <button class=\"tool-bar-button\" aria-label=\"Example\">\n      ...\n    </button>\n-->\n\n<button\n  class=\"tool-bar-button\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Tool Bar Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
