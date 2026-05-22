import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ol
  class="chat-list"
  role="log"
  aria-live="polite"></ol>`;

const meta = {
  title: 'Headless/ChatList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
