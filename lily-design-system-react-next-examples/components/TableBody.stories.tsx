import type { Meta, StoryObj } from '@storybook/react-vite';
import TableBody from './TableBody';

const meta = {
  title: 'Headless/TableBody',
  component: TableBody,
  tags: ['autodocs']
} satisfies Meta<typeof TableBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
