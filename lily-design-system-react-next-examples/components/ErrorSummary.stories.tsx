import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ErrorSummary from './ErrorSummary';

const meta = {
  title: 'Examples/ErrorSummary',
  component: ErrorSummary,
  tags: ['autodocs']
} satisfies Meta<typeof ErrorSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
