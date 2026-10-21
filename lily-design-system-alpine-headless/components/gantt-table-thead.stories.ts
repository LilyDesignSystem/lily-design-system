import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table><thead class=\"gantt-table-thead\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</thead></table>";

const meta = {
  title: 'Headless/Gantt Table Thead',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
