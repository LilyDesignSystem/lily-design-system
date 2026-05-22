import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IconListItem from './IconListItem.vue';

const meta = {
  title: 'Headless/IconListItem',
  component: IconListItem,
  tags: ['autodocs']
} satisfies Meta<typeof IconListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
