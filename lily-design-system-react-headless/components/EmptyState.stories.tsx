import type { Meta, StoryObj } from '@storybook/react-vite';
import EmptyState from './EmptyState';

const meta = {
  title: 'Headless/EmptyState',
  component: EmptyState,
  tags: ['autodocs']
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "No results", children: "Nothing to show yet." }
};
