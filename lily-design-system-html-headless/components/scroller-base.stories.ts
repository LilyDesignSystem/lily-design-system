import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="scroller-base"
  aria-label=""
  data-offset="0.5"
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/ScrollerBase',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
