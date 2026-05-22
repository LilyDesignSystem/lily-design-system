import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ChatList from './ChatList';

const meta = {
  title: 'Examples/ChatList',
  component: ChatList,
  tags: ['autodocs']
} satisfies Meta<typeof ChatList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
