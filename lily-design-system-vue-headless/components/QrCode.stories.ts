import type { Meta, StoryObj } from '@storybook/vue3-vite';
import QrCode from './QrCode.vue';

const meta = {
  title: 'Headless/QrCode',
  component: QrCode,
  tags: ['autodocs']
} satisfies Meta<typeof QrCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
