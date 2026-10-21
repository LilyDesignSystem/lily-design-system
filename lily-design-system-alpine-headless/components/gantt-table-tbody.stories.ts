import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table><tbody class=\"gantt-table-tbody\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tbody></table>";

const meta = {
  title: 'Headless/Gantt Table Tbody',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
