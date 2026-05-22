import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TimePickerInput from './TimePickerInput';

const meta = {
  title: 'Examples/TimePickerInput',
  component: TimePickerInput,
  tags: ['autodocs']
} satisfies Meta<typeof TimePickerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
