import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ContainerWithFluidWidth from './ContainerWithFluidWidth';

const meta = {
  title: 'Examples/ContainerWithFluidWidth',
  component: ContainerWithFluidWidth,
  tags: ['autodocs']
} satisfies Meta<typeof ContainerWithFluidWidth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
