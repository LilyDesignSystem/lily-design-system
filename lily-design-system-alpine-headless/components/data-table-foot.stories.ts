import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DataTableFoot component -->\n<!--\n  Description: a data table interactive grid tfoot for displaying and sorting tabular data\n  HTML tag: <tfoot> wrapped in <table>\n  CSS class: data-table-foot\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tfoot class=\"data-table-foot\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tfoot></table>";

const meta = {
  title: 'Headless/Data Table Foot',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
