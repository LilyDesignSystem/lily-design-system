import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TreeMenu from './TreeMenu';

const meta = {
  title: 'Examples/TreeMenu',
  component: TreeMenu,
  tags: ['autodocs']
} satisfies Meta<typeof TreeMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
