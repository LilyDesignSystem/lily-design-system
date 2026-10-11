import type { Meta, StoryObj } from '@storybook/react-vite';
import BreadcrumbListItem from './BreadcrumbListItem';

const meta = {
  title: 'Headless/BreadcrumbListItem',
  component: BreadcrumbListItem,
  tags: ['autodocs']
} satisfies Meta<typeof BreadcrumbListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
