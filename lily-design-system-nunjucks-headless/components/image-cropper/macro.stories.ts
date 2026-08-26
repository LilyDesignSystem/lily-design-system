import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="image-cropper"
  role="application"
  aria-label="Image cropper"></div>`;

const meta = {
  title: 'Headless/ImageCropper',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
