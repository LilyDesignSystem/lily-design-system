import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<ul
  class="collection-list"
  aria-label=""
>
  <!-- Consumer provides <li class="collection-list-item"> children -->
</ul>`;

const meta = {
  title: 'Headless/CollectionList',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
