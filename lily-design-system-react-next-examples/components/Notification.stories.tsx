import type { Meta, StoryObj } from '@storybook/react-vite';
import Notification from './Notification';

const meta = {
  title: 'Headless/Notification',
  component: Notification,
  tags: ['autodocs']
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
