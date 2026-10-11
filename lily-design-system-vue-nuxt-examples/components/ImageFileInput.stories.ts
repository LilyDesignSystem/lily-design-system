import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ImageFileInput from './ImageFileInput.vue';

const meta = {
  title: 'Headless/ImageFileInput',
  component: ImageFileInput,
  tags: ['autodocs']
} satisfies Meta<typeof ImageFileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
