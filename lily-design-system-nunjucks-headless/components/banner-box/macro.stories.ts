import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="banner-box"></div>`;

const meta = {
  title: 'Headless/BannerBox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
