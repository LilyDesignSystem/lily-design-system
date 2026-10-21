import type { Meta, StoryObj } from '@storybook/react-vite';
import ErrorSummary from './ErrorSummary';

const meta = {
  title: 'Headless/ErrorSummary',
  component: ErrorSummary,
  tags: ['autodocs']
} satisfies Meta<typeof ErrorSummary>;

export default meta;
type Story = StoryObj<typeof ErrorSummary>;

export const Default: Story = {};
