import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ArticleLayout from './ArticleLayout';

const meta = {
  title: 'Examples/ArticleLayout',
  component: ArticleLayout,
  tags: ['autodocs']
} satisfies Meta<typeof ArticleLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
