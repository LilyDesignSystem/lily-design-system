import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="draft"
  aria-label=""
  data-status=""
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/Draft',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
