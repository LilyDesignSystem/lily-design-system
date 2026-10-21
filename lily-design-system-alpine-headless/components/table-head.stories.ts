import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TableHead component -->\n<!--\n  Description: a table header section\n  HTML tag: <div>\n  CSS class: table-head\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"table-head\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"table-head\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Table Head',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
