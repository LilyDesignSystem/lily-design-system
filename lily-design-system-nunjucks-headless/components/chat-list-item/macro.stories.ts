import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<li
  class="chat-list-item"></li>`;

const meta = {
  title: 'Headless/ChatListItem',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
