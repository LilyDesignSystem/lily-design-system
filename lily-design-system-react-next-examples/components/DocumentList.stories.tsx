import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DocumentList from './DocumentList';

const meta = {
  title: 'Examples/DocumentList',
  component: DocumentList,
  tags: ['autodocs']
} satisfies Meta<typeof DocumentList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
