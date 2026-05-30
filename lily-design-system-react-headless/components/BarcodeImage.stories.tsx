import type { Meta, StoryObj } from '@storybook/react-vite';
import BarcodeImage from './BarcodeImage';

const meta = {
  title: 'Headless/BarcodeImage',
  component: BarcodeImage,
  tags: ['autodocs']
} satisfies Meta<typeof BarcodeImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "data:image/svg+xml;utf8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%2240%22%3E%3Crect width=%22160%22 height=%2240%22 fill=%22white%22/%3E%3C/svg%3E",
    alt: "Order number 12345"
  }
};
