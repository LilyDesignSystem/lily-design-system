import type { Meta, StoryObj } from '@storybook/react-vite';
import ContainerWithFixedWidth from './ContainerWithFixedWidth';

const meta = {
  title: 'Headless/ContainerWithFixedWidth',
  component: ContainerWithFixedWidth,
  tags: ['autodocs']
} satisfies Meta<typeof ContainerWithFixedWidth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
