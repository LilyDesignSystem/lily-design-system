import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<aside
  class="related-content"
  aria-label=""
>
  <!-- Consumer provides content -->
</aside>`;

const meta = {
  title: 'Headless/RelatedContent',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
