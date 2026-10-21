import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GanttTableTh component -->\n<!--\n  Description: a Gantt chart table interactive grid column for planning schedule visualization\n  HTML tag: <th> wrapped in <table><thead><tr>\n  CSS class: gantt-table-th\n  Accessibility: aria-label for accessible name\n-->\n\n<table><thead><tr><th class=\"gantt-table-th\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</th></tr></thead></table>";

const meta = {
  title: 'Headless/Gantt Table TH',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
