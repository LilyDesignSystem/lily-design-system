import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<article
  class="comment"
  aria-label=""
>
  <!-- Consumer provides content -->
</article>`;

const meta = {
  title: 'Headless/Comment',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
