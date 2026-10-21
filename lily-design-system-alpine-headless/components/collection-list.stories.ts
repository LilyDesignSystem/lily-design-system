import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<ul\n  class=\"collection-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides <li class=\"collection-list-item\"> children -->\n</ul>";

const meta = {
  title: 'Headless/Collection List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
