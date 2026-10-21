import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Table component -->\n<!--\n  Description: a table with rows and columns\n  HTML tag: <div>\n  CSS class: table\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"table\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"table\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Table',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
