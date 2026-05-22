import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TreeListItem from './TreeListItem.vue';

const meta = {
  title: 'Headless/TreeListItem',
  component: TreeListItem,
  tags: ['autodocs']
} satisfies Meta<typeof TreeListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
