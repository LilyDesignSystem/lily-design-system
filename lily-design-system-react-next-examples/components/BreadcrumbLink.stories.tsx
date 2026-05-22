import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BreadcrumbLink from './BreadcrumbLink';

const meta = {
  title: 'Examples/BreadcrumbLink',
  component: BreadcrumbLink,
  tags: ['autodocs']
} satisfies Meta<typeof BreadcrumbLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
