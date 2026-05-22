import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<caption
  class="caption"
>
  <!-- Consumer provides caption text -->
</caption>`;

const meta = {
  title: 'Headless/Caption',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
