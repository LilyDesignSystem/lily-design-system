import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CheckListItem from './CheckListItem.vue';

const meta = {
  title: 'Headless/CheckListItem',
  component: CheckListItem,
  tags: ['autodocs']
} satisfies Meta<typeof CheckListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
