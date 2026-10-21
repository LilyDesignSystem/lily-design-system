import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<ul\n  class=\"do-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides list items -->\n</ul>";

const meta = {
  title: 'Headless/Do List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
