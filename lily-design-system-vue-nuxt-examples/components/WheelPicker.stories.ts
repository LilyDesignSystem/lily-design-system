import type { Meta, StoryObj } from '@storybook/vue3-vite';
import WheelPicker from './WheelPicker.vue';

const meta = {
  title: 'Headless/WheelPicker',
  component: WheelPicker,
  tags: ['autodocs']
} satisfies Meta<typeof WheelPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Month',
    modelValue: '2',
    options: [{ value: '1', label: 'January' }, { value: '2', label: 'February' }, { value: '3', label: 'March' }],
  },
};
