import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- KbdShortcut component -->\n<!--\n  Description: a keyboard shortcut made of several keys, such as Ctrl + K\n  HTML tag: <kbd> containing one <kbd class=\"kbd-shortcut-key\"> per key\n  CSS class: kbd-shortcut (root), kbd-shortcut-key, kbd-shortcut-separator\n  Keyboard: None (passive element)\n  Accessibility: separators are aria-hidden so they are not read; an optional aria-label on the\n    root gives a spoken form, otherwise screen readers read the keys. The separator default\n    is \"+\" and is decorative.\n  Usage:\n    <kbd class=\"kbd-shortcut\" aria-label=\"Control K\">\n      <kbd class=\"kbd-shortcut-key\">Ctrl</kbd><span class=\"kbd-shortcut-separator\" aria-hidden=\"true\">+</span><kbd class=\"kbd-shortcut-key\">K</kbd>\n    </kbd>\n-->\n\n<kbd class=\"kbd-shortcut\" aria-label=\"Control K\"><kbd class=\"kbd-shortcut-key\">Ctrl</kbd><span class=\"kbd-shortcut-separator\" aria-hidden=\"true\">+</span><kbd class=\"kbd-shortcut-key\">K</kbd></kbd>";

const meta = {
  title: 'Headless/Kbd Shortcut',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
