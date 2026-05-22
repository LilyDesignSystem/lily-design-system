import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PhotoPack from './PhotoPack.vue';

const meta = {
  title: 'Headless/PhotoPack',
  component: PhotoPack,
  tags: ['autodocs']
} satisfies Meta<typeof PhotoPack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
