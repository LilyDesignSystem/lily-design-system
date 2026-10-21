import type { Meta, StoryObj } from '@storybook/react-vite';
import ArticleLayout from './ArticleLayout';

const meta = {
  title: 'Headless/ArticleLayout',
  component: ArticleLayout,
  tags: ['autodocs']
} satisfies Meta<typeof ArticleLayout>;

export default meta;
type Story = StoryObj<typeof ArticleLayout>;

export const Default: Story = {};
