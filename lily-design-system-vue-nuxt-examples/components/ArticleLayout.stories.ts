import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ArticleLayout from './ArticleLayout.vue';

const meta = {
  title: 'Examples/ArticleLayout',
  component: ArticleLayout,
  tags: ['autodocs']
} satisfies Meta<typeof ArticleLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
