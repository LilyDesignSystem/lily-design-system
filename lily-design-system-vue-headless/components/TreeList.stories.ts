import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TreeList from './TreeList.vue';

const meta = {
  title: 'Headless/TreeList',
  component: TreeList,
  tags: ['autodocs']
} satisfies Meta<typeof TreeList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
