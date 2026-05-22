import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BreadcrumbList from './BreadcrumbList.vue';

const meta = {
  title: 'Headless/BreadcrumbList',
  component: BreadcrumbList,
  tags: ['autodocs']
} satisfies Meta<typeof BreadcrumbList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
