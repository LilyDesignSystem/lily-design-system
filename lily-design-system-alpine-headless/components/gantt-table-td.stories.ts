import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table><tr><td class=\"gantt-table-td\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</td></tr></table>";

const meta = {
  title: 'Headless/Gantt Table TD',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
