import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<form class=\"chat-composer\">\n  <textarea class=\"chat-composer-input\" aria-label=\"Message\" rows=\"1\"></textarea>\n  <button class=\"chat-composer-button\" type=\"submit\" data-state=\"send\" disabled><span class=\"chat-composer-button-label\">Send</span></button>\n</form>\n<form class=\"chat-composer\" id=\"chat-composer-busy\">\n  <textarea class=\"chat-composer-input\" aria-label=\"Message\" rows=\"2\">Explain headless components</textarea>\n  <button class=\"chat-composer-button\" type=\"button\" data-state=\"stop\"><span class=\"chat-composer-button-label\">Stop</span></button>\n</form>";

const meta = {
  title: 'Headless/Chat Composer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
