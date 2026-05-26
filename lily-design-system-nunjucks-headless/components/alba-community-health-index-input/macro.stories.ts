import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<input
  class="alba-community-health-index-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Community Health Index">`;

const meta = {
  title: 'Headless/AlbaCommunityHealthIndexInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
