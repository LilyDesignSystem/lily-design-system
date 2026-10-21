import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<a\n  class=\"digital-object-identifier-link\"\n  aria-label=\"\"\n  href=\"\"\n>\n  <!-- Consumer provides content -->\n</a>";

const meta = {
  title: 'Headless/Digital Object Identifier Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
