import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="aspect-ratio-container"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/AspectRatioContainer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
