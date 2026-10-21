import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table><tr class=\"gantt-table-tr\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tr></table>";

const meta = {
  title: 'Headless/Gantt Table Tr',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
