import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CollectionList from './CollectionList.vue';

const meta = {
  title: 'Headless/CollectionList',
  component: CollectionList,
  tags: ['autodocs']
} satisfies Meta<typeof CollectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
