import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ErrorMessage from './ErrorMessage';

const meta = {
  title: 'Examples/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs']
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
