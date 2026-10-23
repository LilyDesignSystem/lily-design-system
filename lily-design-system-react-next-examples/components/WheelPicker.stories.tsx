import type { Meta, StoryObj } from '@storybook/react-vite';
import WheelPicker from './WheelPicker';

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
    value: '2',
    options: [{ value: '1', label: 'January' }, { value: '2', label: 'February' }, { value: '3', label: 'March' }],
  },
};
