import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="content-block"
  aria-label=""
  data-width="normal"
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/ContentBlock',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
