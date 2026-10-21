import type { Meta, StoryObj } from '@storybook/react-vite';
import Toast from './Toast';

const meta = {
  title: 'Headless/Toast',
  component: Toast,
  tags: ['autodocs']
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {};
