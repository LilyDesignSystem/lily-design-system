import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="graphic-block"
  role="img"
  aria-label=""
>
  <figcaption class="graphic-block-caption">
    <!-- Consumer provides title, description, notes -->
  </figcaption>
  <div class="graphic-block-content">
    <!-- Consumer provides chart/graphic -->
  </div>
</figure>`;

const meta = {
  title: 'Headless/GraphicBlock',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
