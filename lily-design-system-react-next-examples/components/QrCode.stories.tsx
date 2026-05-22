import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import QrCode from './QrCode';

const meta = {
  title: 'Examples/QrCode',
  component: QrCode,
  tags: ['autodocs']
} satisfies Meta<typeof QrCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
