import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Emoji from './Emoji.vue';

const meta = {
  title: 'Headless/Emoji',
  component: Emoji,
  tags: ['autodocs']
} satisfies Meta<typeof Emoji>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
