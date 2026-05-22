import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="graphic-block"
  role="img"
  aria-label=""><div class="graphic-block-content"></div>
</figure>`;

const meta = {
  title: 'Headless/GraphicBlock',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
