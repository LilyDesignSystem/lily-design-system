import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<img
  class="barcode-image"
  src=""
  alt=""
/>`;

const meta = {
  title: 'Headless/BarcodeImage',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
