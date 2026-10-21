import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TableTD component -->\n<!--\n  Description: a table data cell\n  HTML tag: <div>\n  CSS class: table-td\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"table-td\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"table-td\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Table TD',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
