import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DataTableHead component -->\n<!--\n  Description: a data table interactive grid thead for displaying and sorting tabular data\n  HTML tag: <thead> wrapped in <table>\n  CSS class: data-table-head\n  Accessibility: aria-label for accessible name\n-->\n\n<table><thead class=\"data-table-head\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</thead></table>";

const meta = {
  title: 'Headless/Data Table Head',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
