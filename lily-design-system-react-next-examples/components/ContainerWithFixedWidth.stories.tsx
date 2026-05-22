import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ContainerWithFixedWidth from './ContainerWithFixedWidth';

const meta = {
  title: 'Examples/ContainerWithFixedWidth',
  component: ContainerWithFixedWidth,
  tags: ['autodocs']
} satisfies Meta<typeof ContainerWithFixedWidth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
