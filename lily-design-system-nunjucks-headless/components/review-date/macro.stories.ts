import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<p
  class="review-date">
  <span class="review-date-reviewed">
    Page last reviewed: <time datetime=""></time>
  </span></p>`;

const meta = {
  title: 'Headless/ReviewDate',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
