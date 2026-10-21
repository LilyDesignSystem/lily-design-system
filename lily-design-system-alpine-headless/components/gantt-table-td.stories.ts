import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GanttTableTd component -->\n<!--\n  Description: a Gantt chart table interactive grid data cell for planning schedule visualization\n  HTML tag: <td> wrapped in <table><tr>\n  CSS class: gantt-table-td\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tr><td class=\"gantt-table-td\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</td></tr></table>";

const meta = {
  title: 'Headless/Gantt Table TD',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
