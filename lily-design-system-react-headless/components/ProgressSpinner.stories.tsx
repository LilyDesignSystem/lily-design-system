import type { Meta, StoryObj } from '@storybook/react-vite';
import ProgressSpinner from './ProgressSpinner';

const meta = {
  title: 'Headless/ProgressSpinner',
  component: ProgressSpinner,
  tags: ['autodocs']
} satisfies Meta<typeof ProgressSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
