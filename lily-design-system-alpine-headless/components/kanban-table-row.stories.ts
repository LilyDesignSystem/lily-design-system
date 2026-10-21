import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table><tr class=\"kanban-table-row\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tr></table>";

const meta = {
  title: 'Headless/Kanban Table Row',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
