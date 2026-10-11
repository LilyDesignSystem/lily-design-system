import type { Meta, StoryObj } from '@storybook/react-vite';
import ContainerWithFluidWidth from './ContainerWithFluidWidth';

const meta = {
  title: 'Headless/ContainerWithFluidWidth',
  component: ContainerWithFluidWidth,
  tags: ['autodocs']
} satisfies Meta<typeof ContainerWithFluidWidth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
