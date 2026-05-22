import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="affix"
  style="position: sticky; top: 0;"
  data-offset-top="0"
>
  <!-- Consumer provides the content to be pinned to the viewport -->
</div>`;

const meta = {
  title: 'Headless/Affix',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
