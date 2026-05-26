import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="alba-community-health-index-view"
  aria-label="Community Health Index"
>sample-value</span>`;

const meta = {
  title: 'Headless/AlbaCommunityHealthIndexView',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
