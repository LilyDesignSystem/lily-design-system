import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ImageCropper from './ImageCropper.vue';

const meta = {
  title: 'Headless/ImageCropper',
  component: ImageCropper,
  tags: ['autodocs']
} satisfies Meta<typeof ImageCropper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
