import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ChatListItem from './ChatListItem';

const meta = {
  title: 'Examples/ChatListItem',
  component: ChatListItem,
  tags: ['autodocs']
} satisfies Meta<typeof ChatListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
