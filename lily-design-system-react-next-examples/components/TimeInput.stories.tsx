import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TimeInput from './TimeInput';

const meta = {
  title: 'Examples/TimeInput',
  component: TimeInput,
  tags: ['autodocs']
} satisfies Meta<typeof TimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
