import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import RangeInput from './RangeInput';

const meta = {
  title: 'Examples/RangeInput',
  component: RangeInput,
  tags: ['autodocs']
} satisfies Meta<typeof RangeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
