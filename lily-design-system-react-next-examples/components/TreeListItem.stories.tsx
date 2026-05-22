import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TreeListItem from './TreeListItem';

const meta = {
  title: 'Examples/TreeListItem',
  component: TreeListItem,
  tags: ['autodocs']
} satisfies Meta<typeof TreeListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
