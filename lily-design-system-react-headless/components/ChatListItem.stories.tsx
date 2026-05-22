import type { Meta, StoryObj } from '@storybook/react-vite';
import ChatListItem from './ChatListItem';

const meta = {
  title: 'Headless/ChatListItem',
  component: ChatListItem,
  tags: ['autodocs']
} satisfies Meta<typeof ChatListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
