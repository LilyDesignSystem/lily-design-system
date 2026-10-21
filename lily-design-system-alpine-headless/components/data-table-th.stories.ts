import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DataTableTh component -->\n<!--\n  Description: a data table interactive grid column for displaying and sorting tabular data\n  HTML tag: <th> wrapped in <table><thead><tr>\n  CSS class: data-table-th\n  Accessibility: aria-label for accessible name\n-->\n\n<table><thead><tr><th class=\"data-table-th\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</th></tr></thead></table>";

const meta = {
  title: 'Headless/Data Table TH',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
