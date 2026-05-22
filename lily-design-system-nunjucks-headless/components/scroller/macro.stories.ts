import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="scroller"
  data-offset="0.5">
  <div class="scroller-background" aria-live="polite"></div>
  <div class="scroller-foreground scroller-base" data-offset="0.5"></div>
</div>`;

const meta = {
  title: 'Headless/Scroller',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
