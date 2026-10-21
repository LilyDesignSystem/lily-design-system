import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- QrCodeImage component -->\n<!--\n  Description: a QR code image generated from text or URL data\n  HTML tag: <div>\n  CSS class: qr-code-image\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"qr-code-image\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"qr-code-image\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Qr Code Image',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
