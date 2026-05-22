import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import BreadcrumbNav from './BreadcrumbNav';

const meta = {
  title: 'Examples/BreadcrumbNav',
  component: BreadcrumbNav,
  tags: ['autodocs']
} satisfies Meta<typeof BreadcrumbNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
