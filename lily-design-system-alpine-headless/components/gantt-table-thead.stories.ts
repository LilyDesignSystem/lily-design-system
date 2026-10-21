import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GanttTableThead component -->\n<!--\n  Description: a Gantt chart table interactive grid thead for planning schedule visualization\n  HTML tag: <thead> wrapped in <table>\n  CSS class: gantt-table-thead\n  Accessibility: aria-label for accessible name\n-->\n\n<table><thead class=\"gantt-table-thead\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</thead></table>";

const meta = {
  title: 'Headless/Gantt Table Thead',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
