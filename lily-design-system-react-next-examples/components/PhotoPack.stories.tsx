import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PhotoPack from './PhotoPack';

const meta = {
  title: 'Examples/PhotoPack',
  component: PhotoPack,
  tags: ['autodocs']
} satisfies Meta<typeof PhotoPack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
