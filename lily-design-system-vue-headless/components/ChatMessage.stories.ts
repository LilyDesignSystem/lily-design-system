import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ChatMessage from './ChatMessage.vue';

const meta = {
  title: 'Headless/ChatMessage',
  component: ChatMessage,
  tags: ['autodocs']
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
