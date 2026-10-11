import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PaginationList from './PaginationList.vue';

const meta = {
  title: 'Headless/PaginationList',
  component: PaginationList,
  tags: ['autodocs']
} satisfies Meta<typeof PaginationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
