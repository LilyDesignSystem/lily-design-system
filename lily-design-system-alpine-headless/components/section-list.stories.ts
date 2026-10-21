import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<ul\n  class=\"section-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</ul>";

const meta = {
  title: 'Headless/Section List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
