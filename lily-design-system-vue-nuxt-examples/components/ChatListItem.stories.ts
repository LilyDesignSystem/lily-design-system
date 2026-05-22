import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ChatListItem from './ChatListItem.vue';

const meta = {
  title: 'Examples/ChatListItem',
  component: ChatListItem,
  tags: ['autodocs']
} satisfies Meta<typeof ChatListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
