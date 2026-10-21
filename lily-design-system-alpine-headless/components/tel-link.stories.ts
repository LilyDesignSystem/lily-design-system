import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<a\n  class=\"tel-link\"\n  aria-label=\"\"\n  href=\"tel:\"\n>\n  <!-- Consumer provides link text -->\n</a>";

const meta = {
  title: 'Headless/Tel Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
