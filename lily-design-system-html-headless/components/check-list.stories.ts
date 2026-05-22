import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ol
  class="check-list"
  aria-label=""
>
  <!-- Consumer provides list items -->
</ol>`;

const meta = {
  title: 'Headless/CheckList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
