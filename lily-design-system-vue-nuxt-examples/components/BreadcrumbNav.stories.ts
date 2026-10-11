import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BreadcrumbNav from './BreadcrumbNav.vue';

const meta = {
  title: 'Headless/BreadcrumbNav',
  component: BreadcrumbNav,
  tags: ['autodocs']
} satisfies Meta<typeof BreadcrumbNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
