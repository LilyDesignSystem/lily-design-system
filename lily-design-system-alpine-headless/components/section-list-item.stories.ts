import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<li\n  class=\"section-list-item\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</li>";

const meta = {
  title: 'Headless/Section List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
