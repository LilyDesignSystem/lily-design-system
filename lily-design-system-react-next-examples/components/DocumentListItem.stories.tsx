import type { Meta, StoryObj } from '@storybook/react-vite';
import DocumentListItem from './DocumentListItem';

const meta = {
  title: 'Headless/DocumentListItem',
  component: DocumentListItem,
  tags: ['autodocs']
} satisfies Meta<typeof DocumentListItem>;

export default meta;
type Story = StoryObj<typeof DocumentListItem>;

export const Default: Story = {};
