import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- RelatedContent component -->\n<aside\n  class=\"related-content\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</aside>";

const meta = {
  title: 'Headless/Related Content',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
