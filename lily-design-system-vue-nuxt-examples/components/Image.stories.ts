import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Image from './Image.vue';

const meta = {
  title: 'Headless/Image',
  component: Image,
  tags: ['autodocs']
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
