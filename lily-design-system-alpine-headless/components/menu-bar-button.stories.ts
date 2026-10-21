import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MenuBarButton component -->\n<!--\n  Description: one item in a menu bar\n  HTML tag: <button>\n  CSS class: menu-bar-button\n  Keyboard: Tab to focus, Enter or Space to activate\n  Accessibility: role=\"menuitem\", Implicit button role, aria-label for accessible name\n  Usage:\n    <button class=\"menu-bar-button\" role=\"menuitem\" aria-label=\"Example\">\n      ...\n    </button>\n-->\n\n<button\n  class=\"menu-bar-button\"\n  role=\"menuitem\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides button content -->\n</button>";

const meta = {
  title: 'Headless/Menu Bar Button',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
