import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PaginationLink from './PaginationLink';

const meta = {
  title: 'Examples/PaginationLink',
  component: PaginationLink,
  tags: ['autodocs']
} satisfies Meta<typeof PaginationLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
