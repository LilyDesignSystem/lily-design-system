import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="area-chart"
  aria-label=""
>
  <!-- Consumer provides content -->
</figure>`;

const meta = {
  title: 'Headless/AreaChart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
