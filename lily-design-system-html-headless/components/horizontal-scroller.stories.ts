import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="horizontal-scroller"
  role="region"
  aria-label=""
  tabindex="0"
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/HorizontalScroller',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
