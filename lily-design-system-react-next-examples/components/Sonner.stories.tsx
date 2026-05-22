import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Sonner from './Sonner';

const meta = {
  title: 'Examples/Sonner',
  component: Sonner,
  tags: ['autodocs']
} satisfies Meta<typeof Sonner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
