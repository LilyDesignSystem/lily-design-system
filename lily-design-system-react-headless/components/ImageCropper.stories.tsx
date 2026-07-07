import type { Meta, StoryObj } from '@storybook/react-vite';
import ImageCropper from './ImageCropper';

const meta = {
  title: 'Headless/ImageCropper',
  component: ImageCropper,
  tags: ['autodocs']
} satisfies Meta<typeof ImageCropper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
