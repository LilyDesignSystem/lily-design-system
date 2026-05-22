import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="byline"
  aria-label=""
>
  <span class="byline-authors">
    <!-- Consumer provides authors -->
  </span>
  <span class="byline-published">
    <!-- Consumer provides <time datetime="..."> -->
  </span>
</div>`;

const meta = {
  title: 'Headless/Byline',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
