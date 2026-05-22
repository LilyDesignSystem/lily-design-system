import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NorthernIrelandHealthAndCareNumberInput from './NorthernIrelandHealthAndCareNumberInput';

const meta = {
  title: 'Examples/NorthernIrelandHealthAndCareNumberInput',
  component: NorthernIrelandHealthAndCareNumberInput,
  tags: ['autodocs']
} satisfies Meta<typeof NorthernIrelandHealthAndCareNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
