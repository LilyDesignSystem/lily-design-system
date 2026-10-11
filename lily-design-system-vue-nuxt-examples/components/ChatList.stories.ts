import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ChatList from './ChatList.vue';

const meta = {
  title: 'Headless/ChatList',
  component: ChatList,
  tags: ['autodocs']
} satisfies Meta<typeof ChatList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
