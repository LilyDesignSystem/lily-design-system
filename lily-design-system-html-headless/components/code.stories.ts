import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<code
  class="code"
  aria-label=""
>
  <!-- Consumer provides content -->
</code>`;

const meta = {
  title: 'Headless/Code',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
