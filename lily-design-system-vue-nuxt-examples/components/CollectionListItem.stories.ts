import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CollectionListItem from './CollectionListItem.vue';

const meta = {
  title: 'Headless/CollectionListItem',
  component: CollectionListItem,
  tags: ['autodocs']
} satisfies Meta<typeof CollectionListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
