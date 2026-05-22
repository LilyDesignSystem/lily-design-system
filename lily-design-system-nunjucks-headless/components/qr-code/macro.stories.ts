import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<img
  class="qr-code"
  src=""
  alt="QR code">`;

const meta = {
  title: 'Headless/QrCode',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
