import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ChatMessage from './ChatMessage';

const meta = {
  title: 'Examples/ChatMessage',
  component: ChatMessage,
  tags: ['autodocs']
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
