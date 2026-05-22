import type { Meta, StoryObj } from '@storybook/react-vite';
import TimePickerInput from './TimePickerInput';

const meta = {
  title: 'Headless/TimePickerInput',
  component: TimePickerInput,
  tags: ['autodocs']
} satisfies Meta<typeof TimePickerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
