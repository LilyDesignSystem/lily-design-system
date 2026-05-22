import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ContentsList from './ContentsList';

const meta = {
  title: 'Examples/ContentsList',
  component: ContentsList,
  tags: ['autodocs']
} satisfies Meta<typeof ContentsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
