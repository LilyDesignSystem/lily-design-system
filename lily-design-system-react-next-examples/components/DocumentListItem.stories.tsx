import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DocumentListItem from './DocumentListItem';

const meta = {
  title: 'Examples/DocumentListItem',
  component: DocumentListItem,
  tags: ['autodocs']
} satisfies Meta<typeof DocumentListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
