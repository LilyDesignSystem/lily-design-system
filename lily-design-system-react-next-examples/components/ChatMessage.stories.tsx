import type { Meta, StoryObj } from '@storybook/react-vite';
import ChatMessage from './ChatMessage';

const meta = {
  title: 'Headless/ChatMessage',
  component: ChatMessage,
  tags: ['autodocs']
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
