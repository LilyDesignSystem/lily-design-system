import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Progress from './Progress';

const meta = {
  title: 'Examples/Progress',
  component: Progress,
  tags: ['autodocs']
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
