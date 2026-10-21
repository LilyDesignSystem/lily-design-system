import type { Meta, StoryObj } from '@storybook/react-vite';
import DocumentList from './DocumentList';

const meta = {
  title: 'Headless/DocumentList',
  component: DocumentList,
  tags: ['autodocs']
} satisfies Meta<typeof DocumentList>;

export default meta;
type Story = StoryObj<typeof DocumentList>;

export const Default: Story = {};
