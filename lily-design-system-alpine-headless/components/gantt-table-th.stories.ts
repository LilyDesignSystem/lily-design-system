import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table><thead><tr><th class=\"gantt-table-th\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</th></tr></thead></table>";

const meta = {
  title: 'Headless/Gantt Table TH',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
