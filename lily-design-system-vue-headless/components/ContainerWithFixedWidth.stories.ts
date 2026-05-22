import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ContainerWithFixedWidth from './ContainerWithFixedWidth.vue';

const meta = {
  title: 'Headless/ContainerWithFixedWidth',
  component: ContainerWithFixedWidth,
  tags: ['autodocs']
} satisfies Meta<typeof ContainerWithFixedWidth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
