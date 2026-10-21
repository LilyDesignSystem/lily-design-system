import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DataTableRow component -->\n<!--\n  Description: a data table interactive grid row for displaying and sorting tabular data\n  HTML tag: <tr> wrapped in <table>\n  CSS class: data-table-row\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tr class=\"data-table-row\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tr></table>";

const meta = {
  title: 'Headless/Data Table Row',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
