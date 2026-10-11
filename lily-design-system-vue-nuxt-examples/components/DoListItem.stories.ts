import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DoListItem from './DoListItem.vue';

const meta = {
  title: 'Headless/DoListItem',
  component: DoListItem,
  tags: ['autodocs']
} satisfies Meta<typeof DoListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
