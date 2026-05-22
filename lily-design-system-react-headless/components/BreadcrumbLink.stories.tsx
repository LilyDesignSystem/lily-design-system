import type { Meta, StoryObj } from '@storybook/react-vite';
import BreadcrumbLink from './BreadcrumbLink';

const meta = {
  title: 'Headless/BreadcrumbLink',
  component: BreadcrumbLink,
  tags: ['autodocs']
} satisfies Meta<typeof BreadcrumbLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
