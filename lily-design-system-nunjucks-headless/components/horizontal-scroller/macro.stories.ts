import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="horizontal-scroller" role="region"
  tabindex="0"
  aria-label=""></div>`;

const meta = {
  title: 'Headless/HorizontalScroller',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
