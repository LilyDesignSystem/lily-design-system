import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GanttTableTbody component -->\n<!--\n  Description: a Gantt chart table interactive grid tbody for planning schedule visualization\n  HTML tag: <tbody> wrapped in <table>\n  CSS class: gantt-table-tbody\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tbody class=\"gantt-table-tbody\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tbody></table>";

const meta = {
  title: 'Headless/Gantt Table Tbody',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
