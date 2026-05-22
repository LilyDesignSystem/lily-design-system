import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<article
  class="article-layout"></article>`;

const meta = {
  title: 'Headless/ArticleLayout',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
