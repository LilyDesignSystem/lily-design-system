import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="scroller-base"
  data-offset="0.5"></div>`;

const meta = {
  title: 'Headless/ScrollerBase',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
