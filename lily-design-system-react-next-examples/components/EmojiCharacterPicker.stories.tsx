import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EmojiCharacterPicker from './EmojiCharacterPicker';

const meta = {
  title: 'Examples/EmojiCharacterPicker',
  component: EmojiCharacterPicker,
  tags: ['autodocs']
} satisfies Meta<typeof EmojiCharacterPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
