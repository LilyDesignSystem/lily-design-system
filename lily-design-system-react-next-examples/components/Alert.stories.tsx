import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Alert from './Alert';

const meta = {
  title: 'Examples/Alert',
  component: Alert,
  tags: ['autodocs']
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
