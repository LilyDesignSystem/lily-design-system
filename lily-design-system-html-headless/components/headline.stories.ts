import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="headline"
  aria-label=""
>
  <h1 class="headline-heading">
    <!-- Consumer provides heading text -->
  </h1>
  <div class="headline-subtitle">
    <!-- Consumer provides subtitle -->
  </div>
  <div class="headline-byline">
    <!-- Consumer provides byline -->
  </div>
</div>`;

const meta = {
  title: 'Headless/Headline',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
