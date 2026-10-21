import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<ul\n  class=\"icon-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides <li class=\"icon-list-item\"> children -->\n</ul>";

const meta = {
  title: 'Headless/Icon List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
