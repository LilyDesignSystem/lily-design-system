import type { Meta, StoryObj } from '@storybook/react-vite';
import PhotoPack from './PhotoPack';

const meta = {
  title: 'Headless/PhotoPack',
  component: PhotoPack,
  tags: ['autodocs']
} satisfies Meta<typeof PhotoPack>;

export default meta;
type Story = StoryObj<typeof PhotoPack>;

export const Default: Story = {};
