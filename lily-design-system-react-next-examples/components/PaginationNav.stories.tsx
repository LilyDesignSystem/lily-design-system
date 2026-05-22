import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PaginationNav from './PaginationNav';

const meta = {
  title: 'Examples/PaginationNav',
  component: PaginationNav,
  tags: ['autodocs']
} satisfies Meta<typeof PaginationNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
