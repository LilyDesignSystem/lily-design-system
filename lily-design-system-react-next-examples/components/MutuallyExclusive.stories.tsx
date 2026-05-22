import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MutuallyExclusive from './MutuallyExclusive';

const meta = {
  title: 'Examples/MutuallyExclusive',
  component: MutuallyExclusive,
  tags: ['autodocs']
} satisfies Meta<typeof MutuallyExclusive>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
