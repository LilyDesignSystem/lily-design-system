import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="emoji-character-picker"
  role="dialog"
  aria-label="Emoji picker" hidden></div>`;

const meta = {
  title: 'Headless/EmojiCharacterPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
