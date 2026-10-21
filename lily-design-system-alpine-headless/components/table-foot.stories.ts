import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TableFoot component -->\n<!--\n  Description: a table footer section\n  HTML tag: <div>\n  CSS class: table-foot\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"table-foot\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"table-foot\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Table Foot',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
