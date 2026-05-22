import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CollectionListItem from './CollectionListItem';

const meta = {
  title: 'Examples/CollectionListItem',
  component: CollectionListItem,
  tags: ['autodocs']
} satisfies Meta<typeof CollectionListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
