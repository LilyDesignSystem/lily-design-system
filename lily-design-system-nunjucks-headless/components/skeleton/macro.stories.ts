import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="skeleton"
  data-shape="line"
  aria-hidden="true"></div>`;

const meta = {
  title: 'Headless/Skeleton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
