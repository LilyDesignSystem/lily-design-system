import type { Meta, StoryObj } from '@storybook/react-vite';
import ChatList from './ChatList';

const meta = {
  title: 'Headless/ChatList',
  component: ChatList,
  tags: ['autodocs']
} satisfies Meta<typeof ChatList>;

export default meta;
type Story = StoryObj<typeof ChatList>;

export const Default: Story = {};
