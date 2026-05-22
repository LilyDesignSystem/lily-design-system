import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TableBody from './TableBody';

const meta = {
  title: 'Examples/TableBody',
  component: TableBody,
  tags: ['autodocs']
} satisfies Meta<typeof TableBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
