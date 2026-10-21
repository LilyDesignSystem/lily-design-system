import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DataTable component -->\n<!--\n  Description: a data table interactive grid for displaying and sorting tabular data\n  HTML tag: <table>\n  CSS class: data-table\n  Keyboard: None (passive element)\n  Accessibility: Implicit table role, aria-label for accessible name\n  Usage:\n    <table class=\"data-table\" aria-label=\"Example\">\n      ...\n    </table>\n-->\n\n<table\n  class=\"data-table\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides thead, tbody, tfoot -->\n</table>";

const meta = {
  title: 'Headless/Data Table',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
