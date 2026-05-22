import type { Meta, StoryObj } from '@storybook/react-vite';
import ChatNav from './ChatNav';

const meta = {
  title: 'Headless/ChatNav',
  component: ChatNav,
  tags: ['autodocs']
} satisfies Meta<typeof ChatNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
