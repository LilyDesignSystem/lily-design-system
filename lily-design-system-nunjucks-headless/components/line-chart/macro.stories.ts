import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="line-chart"></figure>`;

const meta = {
  title: 'Headless/LineChart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
