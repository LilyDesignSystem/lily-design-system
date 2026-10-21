import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BarcodeImage component -->\n<!--\n  Description: a visual machine-readable symbolic code image, such as for a scanner\n  HTML tag: <img>\n  CSS class: barcode-image\n  Accessibility: alt text required for accessible name\n-->\n\n<img\n  class=\"barcode-image\"\n  src=\"\"\n  alt=\"\"\n>";

const meta = {
  title: 'Headless/Barcode Image',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
