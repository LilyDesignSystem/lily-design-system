import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ChatNav from './ChatNav';

const meta = {
  title: 'Examples/ChatNav',
  component: ChatNav,
  tags: ['autodocs']
} satisfies Meta<typeof ChatNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
