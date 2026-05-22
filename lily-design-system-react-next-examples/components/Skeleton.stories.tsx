import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Skeleton from './Skeleton';

const meta = {
  title: 'Examples/Skeleton',
  component: Skeleton,
  tags: ['autodocs']
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
