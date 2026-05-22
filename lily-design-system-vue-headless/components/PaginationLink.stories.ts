import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PaginationLink from './PaginationLink.vue';

const meta = {
  title: 'Headless/PaginationLink',
  component: PaginationLink,
  tags: ['autodocs']
} satisfies Meta<typeof PaginationLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
