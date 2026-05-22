import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="avatar-text" aria-hidden="true"></span>`;

const meta = {
  title: 'Headless/AvatarText',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
