import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ContainerWithFluidWidth from './ContainerWithFluidWidth.vue';

const meta = {
  title: 'Headless/ContainerWithFluidWidth',
  component: ContainerWithFluidWidth,
  tags: ['autodocs']
} satisfies Meta<typeof ContainerWithFluidWidth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
