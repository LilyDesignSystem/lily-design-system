import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="area-chart"></figure>`;

const meta = {
  title: 'Headless/AreaChart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
