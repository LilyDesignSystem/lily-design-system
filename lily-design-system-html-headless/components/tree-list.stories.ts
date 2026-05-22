import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ol
  class="tree-list"
  role="tree"
  aria-label=""
>
  <!-- Consumer provides list items -->
</ol>`;

const meta = {
  title: 'Headless/TreeList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
