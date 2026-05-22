import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TreeSelect from './TreeSelect.vue';

const meta = {
  title: 'Headless/TreeSelect',
  component: TreeSelect,
  tags: ['autodocs']
} satisfies Meta<typeof TreeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
