import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<blockquote
  class="blockquote"
  cite=""
  aria-label=""
>
  <!-- Consumer provides quotation content -->
  <footer class="blockquote-citation">
    <!-- Consumer provides citation text (e.g., "— Author Name, Source") -->
  </footer>
</blockquote>`;

const meta = {
  title: 'Headless/Blockquote',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
