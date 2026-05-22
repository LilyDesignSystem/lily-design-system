import type { Meta, StoryObj } from '@storybook/vue3-vite';
import EmojiCharacterPicker from './EmojiCharacterPicker.vue';

const meta = {
  title: 'Headless/EmojiCharacterPicker',
  component: EmojiCharacterPicker,
  tags: ['autodocs']
} satisfies Meta<typeof EmojiCharacterPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
