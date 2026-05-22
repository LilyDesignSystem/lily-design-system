import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NorthernIrelandHealthAndCareNumberView from './NorthernIrelandHealthAndCareNumberView.vue';

const meta = {
  title: 'Headless/NorthernIrelandHealthAndCareNumberView',
  component: NorthernIrelandHealthAndCareNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof NorthernIrelandHealthAndCareNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
