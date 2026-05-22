import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<article
  class="comment">  <div class="comment-header">  </div>
  <div class="comment-body"></div>
</article>`;

const meta = {
  title: 'Headless/Comment',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
