import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BreadcrumbLink from './BreadcrumbLink.vue';

const meta = {
  title: 'Headless/BreadcrumbLink',
  component: BreadcrumbLink,
  tags: ['autodocs']
} satisfies Meta<typeof BreadcrumbLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
