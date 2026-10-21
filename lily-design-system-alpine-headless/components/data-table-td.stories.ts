import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DataTableTd component -->\n<!--\n  Description: a data table interactive grid data cell for displaying and sorting tabular data\n  HTML tag: <td> wrapped in <table><tr>\n  CSS class: data-table-td\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tr><td class=\"data-table-td\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</td></tr></table>";

const meta = {
  title: 'Headless/Data Table TD',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
