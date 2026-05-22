import type { Meta, StoryObj } from '@storybook/react-vite';
import BreadcrumbList from './BreadcrumbList';

const meta = {
  title: 'Headless/BreadcrumbList',
  component: BreadcrumbList,
  tags: ['autodocs']
} satisfies Meta<typeof BreadcrumbList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
