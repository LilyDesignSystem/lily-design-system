import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PaddingReset from './PaddingReset';

const meta = {
  title: 'Examples/PaddingReset',
  component: PaddingReset,
  tags: ['autodocs']
} satisfies Meta<typeof PaddingReset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
