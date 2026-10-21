import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table><tfoot class=\"kanban-table-foot\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tfoot></table>";

const meta = {
  title: 'Headless/Kanban Table Foot',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
