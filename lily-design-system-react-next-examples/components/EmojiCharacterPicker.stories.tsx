import type { Meta, StoryObj } from '@storybook/react-vite';
import EmojiCharacterPicker from './EmojiCharacterPicker';

const meta = {
  title: 'Headless/EmojiCharacterPicker',
  component: EmojiCharacterPicker,
  tags: ['autodocs']
} satisfies Meta<typeof EmojiCharacterPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
