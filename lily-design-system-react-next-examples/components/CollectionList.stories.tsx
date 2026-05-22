import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CollectionList from './CollectionList';

const meta = {
  title: 'Examples/CollectionList',
  component: CollectionList,
  tags: ['autodocs']
} satisfies Meta<typeof CollectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
