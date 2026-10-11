import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ContentsListItem from './ContentsListItem.vue';

const meta = {
  title: 'Headless/ContentsListItem',
  component: ContentsListItem,
  tags: ['autodocs']
} satisfies Meta<typeof ContentsListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
