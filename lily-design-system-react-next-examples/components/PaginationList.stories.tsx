import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PaginationList from './PaginationList';

const meta = {
  title: 'Examples/PaginationList',
  component: PaginationList,
  tags: ['autodocs']
} satisfies Meta<typeof PaginationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
