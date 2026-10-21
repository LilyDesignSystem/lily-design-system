import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- GanttTable component -->\n<!--\n  Description: a Gantt chart table interactive grid for planning schedule visualization\n  HTML tag: <table>\n  CSS class: gantt-table\n  Keyboard: None (passive element)\n  Accessibility: Implicit table role, aria-label for accessible name\n  Usage:\n    <table class=\"gantt-table\" aria-label=\"Example\">\n      ...\n    </table>\n-->\n\n<table\n  class=\"gantt-table\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides thead, tbody, tfoot -->\n</table>";

const meta = {
  title: 'Headless/Gantt Table',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
