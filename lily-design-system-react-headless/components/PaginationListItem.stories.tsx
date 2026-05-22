import type { Meta, StoryObj } from '@storybook/react-vite';
import PaginationListItem from './PaginationListItem';

const meta = {
  title: 'Headless/PaginationListItem',
  component: PaginationListItem,
  tags: ['autodocs']
} satisfies Meta<typeof PaginationListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
