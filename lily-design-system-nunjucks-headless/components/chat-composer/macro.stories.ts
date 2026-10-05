import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<form class="chat-composer"><textarea class="chat-composer-input" aria-label="Message" rows="1"></textarea><button class="chat-composer-button" type="submit" data-state="send" disabled><span class="chat-composer-button-label">Send</span></button></form></div>`;

const meta = {
  title: 'Headless/ChatComposer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
