import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TableBody component -->\n<!--\n  Description: a table body section\n  HTML tag: <div>\n  CSS class: table-body\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"table-body\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"table-body\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Table Body',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
