import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<aside
  class="footnote"
  id=""
  role="note"
  aria-label=""
>
  <!-- Consumer provides footnote content -->
</aside>`;

const meta = {
  title: 'Headless/Footnote',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
