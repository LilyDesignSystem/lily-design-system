import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SectionLink component -->\n<a\n  class=\"section-link\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</a>";

const meta = {
  title: 'Headless/Section Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
