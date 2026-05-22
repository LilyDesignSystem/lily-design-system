import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PaginationNav from './PaginationNav.vue';

const meta = {
  title: 'Headless/PaginationNav',
  component: PaginationNav,
  tags: ['autodocs']
} satisfies Meta<typeof PaginationNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
