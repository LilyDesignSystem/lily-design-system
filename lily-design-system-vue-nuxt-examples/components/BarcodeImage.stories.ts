import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BarcodeImage from './BarcodeImage.vue';

const meta = {
  title: 'Headless/BarcodeImage',
  component: BarcodeImage,
  tags: ['autodocs']
} satisfies Meta<typeof BarcodeImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
