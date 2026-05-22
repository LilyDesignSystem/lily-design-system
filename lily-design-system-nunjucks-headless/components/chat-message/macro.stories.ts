import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<article
  class="chat-message"
  data-origin="peer">  <div class="chat-message-header">  </div>
  <div class="chat-message-body"></div>
</article>`;

const meta = {
  title: 'Headless/ChatMessage',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
