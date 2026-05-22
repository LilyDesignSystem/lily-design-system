import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ProgressSpinner from './ProgressSpinner';

const meta = {
  title: 'Examples/ProgressSpinner',
  component: ProgressSpinner,
  tags: ['autodocs']
} satisfies Meta<typeof ProgressSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
