import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="sankey-chart"
  role="img"
  aria-label="Example"></figure>`;

const meta = {
  title: 'Headless/SankeyChart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
