import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="column-chart"
  aria-label=""
>
  <!-- Consumer provides content -->
</figure>`;

const meta = {
  title: 'Headless/ColumnChart',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
