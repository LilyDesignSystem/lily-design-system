import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TimePickerInput from './TimePickerInput.vue';

const meta = {
  title: 'Examples/TimePickerInput',
  component: TimePickerInput,
  tags: ['autodocs']
} satisfies Meta<typeof TimePickerInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
