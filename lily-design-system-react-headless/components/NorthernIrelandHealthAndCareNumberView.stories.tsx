import type { Meta, StoryObj } from '@storybook/react-vite';
import NorthernIrelandHealthAndCareNumberView from './NorthernIrelandHealthAndCareNumberView';

const meta = {
  title: 'Headless/NorthernIrelandHealthAndCareNumberView',
  component: NorthernIrelandHealthAndCareNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof NorthernIrelandHealthAndCareNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
