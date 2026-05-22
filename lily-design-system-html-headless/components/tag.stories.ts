import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="tag"
  aria-label=""
>
  <!-- Consumer provides text content -->
</span>`;

const meta = {
  title: 'Headless/Tag',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
