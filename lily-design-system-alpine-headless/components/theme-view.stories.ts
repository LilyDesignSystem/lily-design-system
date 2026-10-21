import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ThemeView component -->\n<!--\n  Description: a read-only display of the current theme\n  HTML tag: <span>\n  CSS class: theme-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"theme-view\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"theme-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Theme View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
