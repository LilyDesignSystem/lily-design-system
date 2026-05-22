import type { Meta, StoryObj } from '@storybook/react-vite';
import CollectionListItem from './CollectionListItem';

const meta = {
  title: 'Headless/CollectionListItem',
  component: CollectionListItem,
  tags: ['autodocs']
} satisfies Meta<typeof CollectionListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
