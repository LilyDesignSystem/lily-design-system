import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<form class="chat-composer">
  <textarea class="chat-composer-input" aria-label="Message" rows="1"></textarea>
  <button class="chat-composer-button" type="submit" data-state="send" disabled><span class="chat-composer-button-label">Send</span></button>
</form>
<form class="chat-composer" id="chat-composer-busy">
  <textarea class="chat-composer-input" aria-label="Message" rows="2">Explain headless components</textarea>
  <button class="chat-composer-button" type="button" data-state="stop"><span class="chat-composer-button-label">Stop</span></button>
</form>`;

const meta = {
  title: 'Headless/ChatComposer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
