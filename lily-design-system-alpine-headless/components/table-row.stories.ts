import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TableRow component -->\n<!--\n  Description: a table row\n  HTML tag: <div>\n  CSS class: table-row\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"table-row\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"table-row\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Table Row',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
