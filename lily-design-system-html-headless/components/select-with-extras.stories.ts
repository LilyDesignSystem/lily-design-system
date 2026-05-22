import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="select-with-extras"
  aria-label=""
  aria-label=""
>
  <!-- Consumer provides content -->
</div>`;

const meta = {
  title: 'Headless/SelectWithExtras',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
