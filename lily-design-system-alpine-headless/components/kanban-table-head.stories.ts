import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table><thead class=\"kanban-table-head\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</thead></table>";

const meta = {
  title: 'Headless/Kanban Table Head',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
