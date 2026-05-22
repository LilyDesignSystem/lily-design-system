import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="tab-bar"
  role="tablist"
  aria-orientation="horizontal"></div>`;

const meta = {
  title: 'Headless/TabBar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
