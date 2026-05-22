import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="figure"
  aria-label=""
>
  <!-- Consumer provides figure content and optional caption -->
</figure>`;

const meta = {
  title: 'Headless/Figure',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
