import type { Meta, StoryObj } from '@storybook/react-vite';
import PaginationList from './PaginationList';

const meta = {
  title: 'Headless/PaginationList',
  component: PaginationList,
  tags: ['autodocs']
} satisfies Meta<typeof PaginationList>;

export default meta;
type Story = StoryObj<typeof PaginationList>;

export const Default: Story = {};
