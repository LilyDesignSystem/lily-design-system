import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BreadcrumbList from './BreadcrumbList';

const meta = {
  title: 'Examples/BreadcrumbList',
  component: BreadcrumbList,
  tags: ['autodocs']
} satisfies Meta<typeof BreadcrumbList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
