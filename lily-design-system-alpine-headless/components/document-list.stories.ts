import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DocumentList component -->\n<ul\n  class=\"document-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</ul>";

const meta = {
  title: 'Headless/Document List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
