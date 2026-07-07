import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ImageCropper from './ImageCropper';

const meta = {
  title: 'Examples/ImageCropper',
  component: ImageCropper,
  tags: ['autodocs']
} satisfies Meta<typeof ImageCropper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
