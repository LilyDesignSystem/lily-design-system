import type { Meta, StoryObj } from '@storybook/vue3-vite';
import QrCodeImage from './QrCodeImage.vue';

const meta = {
  title: 'Headless/QrCodeImage',
  component: QrCodeImage,
  tags: ['autodocs']
} satisfies Meta<typeof QrCodeImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
