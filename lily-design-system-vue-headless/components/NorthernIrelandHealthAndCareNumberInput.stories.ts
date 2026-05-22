import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NorthernIrelandHealthAndCareNumberInput from './NorthernIrelandHealthAndCareNumberInput.vue';

const meta = {
  title: 'Headless/NorthernIrelandHealthAndCareNumberInput',
  component: NorthernIrelandHealthAndCareNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof NorthernIrelandHealthAndCareNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
