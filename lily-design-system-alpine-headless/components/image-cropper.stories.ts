import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div class=\"image-cropper\" role=\"application\" aria-label=\"\">\n  <!-- Consumer provides the image and the crop overlay (canvas, SVG handles or a cropping library) -->\n</div>";

const meta = {
  title: 'Headless/Image Cropper',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
