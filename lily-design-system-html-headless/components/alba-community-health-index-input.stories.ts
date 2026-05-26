import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="alba-community-health-index-input"
  type="text"
  aria-label="Community Health Index"
  autocomplete="off"
>`;

const meta = {
  title: 'Headless/AlbaCommunityHealthIndexInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
