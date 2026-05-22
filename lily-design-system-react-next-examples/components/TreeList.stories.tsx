import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TreeList from './TreeList';

const meta = {
  title: 'Examples/TreeList',
  component: TreeList,
  tags: ['autodocs']
} satisfies Meta<typeof TreeList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
