import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="scroll-bar"
  role="scrollbar"
  aria-orientation="vertical"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-valuenow="0"  tabindex="0">
  <div class="scroll-bar-thumb" aria-hidden="true"></div>
</div>`;

const meta = {
  title: 'Headless/ScrollBar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
