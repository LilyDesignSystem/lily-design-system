import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="announcement-banner"></div>`;

const meta = {
  title: 'Headless/AnnouncementBanner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
